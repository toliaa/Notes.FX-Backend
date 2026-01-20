from ninja.security import HttpBearer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

User = get_user_model()

class JWTAuth(HttpBearer):
    """JWT Authentication для Django Ninja"""
    
    def authenticate(self, request, token):
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            
            if not user.is_active:
                return None
            
            return user
        except (InvalidToken, TokenError, User.DoesNotExist):
            return None