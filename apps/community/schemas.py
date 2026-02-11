from ninja import Schema
from datetime import datetime
from typing import Optional, List
from uuid import UUID

# ==================== USER SCHEMA (мінімальний) ====================
class UserMinimalSchema(Schema):
    """Мінімальна інформація про користувача"""
    id: UUID
    username: str
    avatar: Optional[str] = None

# ==================== COMMENT SCHEMAS ====================
class CommentCreateSchema(Schema):
    content: str
    parent_id: Optional[UUID] = None  # Для відповідей на коментарі

class CommentSchema(Schema):
    id: UUID
    user: UserMinimalSchema
    content: str
    parent_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    replies_count: int = 0  # Кількість відповідей

# ==================== LIKE SCHEMAS ====================
class LikeSchema(Schema):
    id: UUID
    user: UserMinimalSchema
    created_at: datetime

# ==================== PUBLIC NOTE SCHEMAS ====================
class PublicNoteSchema(Schema):
    """Публічна нотатка з додатковою інформацією"""
    id: UUID
    title: str
    content: str
    user: UserMinimalSchema
    category: Optional[dict] = None
    tags: List[dict] = []
    created_at: datetime
    updated_at: datetime
    
    # Статистика
    likes_count: int = 0
    comments_count: int = 0
    is_liked: bool = False  # Чи поставив лайк поточний користувач
    
    # Ланцюг ідей
    inspired_by: Optional[dict] = None  # Джерело натхнення

# ==================== IDEA CHAIN SCHEMAS ====================
class InspireSchema(Schema):
    """Для кнопки "Надихнутись" """
    original_note_id: UUID

class ErrorSchema(Schema):
    detail: str