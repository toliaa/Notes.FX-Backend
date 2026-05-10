from ninja.security import HttpBearer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

User = get_user_model()
ACCESS_COOKIE_NAME = "notesfx_access"


class JWTAuth(HttpBearer):
    """JWT authentication for Django Ninja via Bearer header or httpOnly cookie."""

    def __call__(self, request):
        result = super().__call__(request)
        if result:
            return result

        token = request.COOKIES.get(ACCESS_COOKIE_NAME)
        if not token:
            return None

        return self.authenticate(request, token)

    def authenticate(self, request, token):
        try:
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
            user = User.objects.get(id=user_id)

            if not user.is_active:
                return None

            return user
        except (InvalidToken, TokenError, User.DoesNotExist):
            return None
