from ninja import Schema
from datetime import datetime
from typing import Optional
from uuid import UUID

# Request Schemas
class RegisterSchema(Schema):
    username: str
    email: str
    password: str
    password_confirm: str

class LoginSchema(Schema):
    email: str
    password: str

class RefreshTokenSchema(Schema):
    refresh: str

# Response Schemas
class UserSchema(Schema):
    id: UUID
    username: str
    email: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime
    is_verified: bool

class TokenSchema(Schema):
    access: str
    refresh: str
    user: UserSchema

class ErrorSchema(Schema):
    detail: str