from ninja import Router
from ninja.responses import Response
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
import secrets
from notesFx.rate_limit import (
    clear_rate_limit,
    enforce_rate_limit,
    get_client_ip,
    get_rate_limit_error,
    stable_hash,
)
from .schemas import (
    RegisterSchema, LoginSchema, TokenSchema, UserSchema, ErrorSchema
)
from .authentication import JWTAuth

User = get_user_model()
router = Router(tags=["Authentication"])

ACCESS_COOKIE_NAME = "notesfx_access"
REFRESH_COOKIE_NAME = "notesfx_refresh"
CSRF_COOKIE_NAME = "notesfx_csrf"


def cookie_options():
    return {
        "httponly": True,
        "secure": not settings.DEBUG,
        "samesite": "Lax",
        "path": "/",
    }

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def user_to_dict(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "avatar": user.avatar.url if user.avatar else None,
        "bio": user.bio,
        "created_at": user.created_at,
        "is_verified": user.is_verified,
    }


def set_auth_cookies(response, tokens):
    options = cookie_options()
    response.set_cookie(
        ACCESS_COOKIE_NAME,
        tokens["access"],
        max_age=int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
        **options,
    )
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        tokens["refresh"],
        max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
        **options,
    )
    response.set_cookie(
        CSRF_COOKIE_NAME,
        secrets.token_urlsafe(32),
        max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
        httponly=False,
        secure=not settings.DEBUG,
        samesite="Lax",
        path="/",
    )


def clear_auth_cookies(response):
    response.delete_cookie(ACCESS_COOKIE_NAME, path="/", samesite="Lax")
    response.delete_cookie(REFRESH_COOKIE_NAME, path="/", samesite="Lax")
    response.delete_cookie(CSRF_COOKIE_NAME, path="/", samesite="Lax")


def auth_response(data, tokens, status=200):
    response = Response(data, status=status)
    set_auth_cookies(response, tokens)
    return response

@router.post("/register", response={201: TokenSchema, 400: ErrorSchema, 429: ErrorSchema})
def register(request, data: RegisterSchema):
    register_rate_error = enforce_rate_limit(
        key=f"auth:register:ip:{get_client_ip(request)}",
        limit=int(getattr(settings, "AUTH_RATE_LIMIT", 5)),
        window_seconds=int(getattr(settings, "AUTH_RATE_WINDOW_SECONDS", 900)),
    )
    if register_rate_error:
        return 429, {"detail": register_rate_error}

    if data.password != data.password_confirm:
        return 400, {"detail": "Паролі не співпадають"}
    
    if len(data.password) < 8:
        return 400, {"detail": "Пароль повинен містити мінімум 8 символів"}
    
    if User.objects.filter(email=data.email).exists():
        return 400, {"detail": "Користувач з таким email вже існує"}
    
    if User.objects.filter(username=data.username).exists():
        return 400, {"detail": "Користувач з таким username вже існує"}
    
    try:
        user = User.objects.create(
            username=data.username,
            email=data.email,
            password=make_password(data.password)
        )
        
        tokens = get_tokens_for_user(user)
        return auth_response({
            "user": user_to_dict(user)
        }, tokens, status=201)
    except Exception as e:
        return 400, {"detail": f"Помилка: {str(e)}"}

@router.post("/login", response={200: TokenSchema, 401: ErrorSchema, 429: ErrorSchema})
def login(request, data: LoginSchema):
    ip_key = f"auth:login:ip:{get_client_ip(request)}"
    email_key = f"auth:login:email:{stable_hash(data.email)}"
    auth_limit = int(getattr(settings, "AUTH_RATE_LIMIT", 5))
    auth_window = int(getattr(settings, "AUTH_RATE_WINDOW_SECONDS", 900))

    login_rate_error = get_rate_limit_error(ip_key, auth_limit) or get_rate_limit_error(email_key, auth_limit)
    if login_rate_error:
        return 429, {"detail": login_rate_error}

    try:
        user = User.objects.get(email=data.email)
    except User.DoesNotExist:
        enforce_rate_limit(ip_key, auth_limit, auth_window)
        enforce_rate_limit(email_key, auth_limit, auth_window)
        return 401, {"detail": "Невірний email або пароль"}
    
    if not check_password(data.password, user.password):
        enforce_rate_limit(ip_key, auth_limit, auth_window)
        enforce_rate_limit(email_key, auth_limit, auth_window)
        return 401, {"detail": "Невірний email або пароль"}
    
    if not user.is_active:
        return 401, {"detail": "Акаунт деактивовано"}

    clear_rate_limit(ip_key)
    clear_rate_limit(email_key)
    
    tokens = get_tokens_for_user(user)
    return auth_response({
        "user": user_to_dict(user)
    }, tokens)

@router.post("/refresh", response={200: dict, 401: ErrorSchema})
def refresh_token(request):
    try:
        refresh_value = request.COOKIES.get(REFRESH_COOKIE_NAME)
        if not refresh_value:
            return 401, {"detail": "Refresh token is missing"}

        refresh = RefreshToken(refresh_value)
        response = Response({"detail": "Token refreshed"})
        response.set_cookie(
            ACCESS_COOKIE_NAME,
            str(refresh.access_token),
            max_age=int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
            **cookie_options(),
        )
        response.set_cookie(
            CSRF_COOKIE_NAME,
            secrets.token_urlsafe(32),
            max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            httponly=False,
            secure=not settings.DEBUG,
            samesite="Lax",
            path="/",
        )
        return response
    except Exception:
        return 401, {"detail": "Невірний refresh token"}

@router.post("/logout", response={200: dict})
def logout(request):
    response = Response({"detail": "Logged out"})
    clear_auth_cookies(response)
    return response


@router.get("/me", response={200: UserSchema, 401: ErrorSchema}, auth=JWTAuth())
def get_current_user(request):
    """
    Отримання поточного користувача
    Вимагає JWT токен
    """
    return 200, user_to_dict(request.auth)
