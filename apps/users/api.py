from ninja import Router
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .schemas import (
    RegisterSchema, LoginSchema, RefreshTokenSchema,
    TokenSchema, UserSchema, ErrorSchema
)

User = get_user_model()
router = Router(tags=["Authentication"])

def get_tokens_for_user(user):
    """Генерація JWT токенів для користувача"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def user_to_dict(user):
    """Конвертація User в словник"""
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "avatar": user.avatar.url if user.avatar else None,
        "bio": user.bio,
        "created_at": user.created_at,
        "is_verified": user.is_verified,
    }

@router.post("/register", response={201: TokenSchema, 400: ErrorSchema})
def register(request, data: RegisterSchema):
    """Реєстрація нового користувача"""
    
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
        
        return 201, {
            "access": tokens['access'],
            "refresh": tokens['refresh'],
            "user": user_to_dict(user)
        }
    except Exception as e:
        return 400, {"detail": f"Помилка: {str(e)}"}

@router.post("/login", response={200: TokenSchema, 401: ErrorSchema})
def login(request, data: LoginSchema):
    """Вхід користувача"""
    
    try:
        user = User.objects.get(email=data.email)
    except User.DoesNotExist:
        return 401, {"detail": "Невірний email або пароль"}
    
    if not check_password(data.password, user.password):
        return 401, {"detail": "Невірний email або пароль"}
    
    if not user.is_active:
        return 401, {"detail": "Акаунт деактивовано"}
    
    tokens = get_tokens_for_user(user)
    
    return 200, {
        "access": tokens['access'],
        "refresh": tokens['refresh'],
        "user": user_to_dict(user)
    }

@router.post("/refresh", response={200: dict, 401: ErrorSchema})
def refresh_token(request, data: RefreshTokenSchema):
    """Оновлення access токена"""
    
    try:
        refresh = RefreshToken(data.refresh)
        return 200, {"access": str(refresh.access_token)}
    except Exception:
        return 401, {"detail": "Невірний refresh token"}

@router.get("/me", response={200: UserSchema, 401: ErrorSchema})
def get_current_user(request):
    """Отримання поточного користувача"""
    
    if not request.user.is_authenticated:
        return 401, {"detail": "Не авторизований"}
    
    return 200, user_to_dict(request.user)