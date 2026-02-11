from ninja import Schema
from datetime import datetime
from typing import Optional, List
from uuid import UUID

# ==================== CATEGORY SCHEMAS ====================

class CategoryCreateSchema(Schema):
    """Дані для створення категорії"""
    name: str                    # Обов'язково
    color: str = "#6366f1"       # За замовчуванням синій

class CategorySchema(Schema):
    """Повна інформація про категорію (відповідь API)"""
    id: UUID
    name: str
    color: str
    created_at: datetime

# ==================== TAG SCHEMAS ====================

class TagCreateSchema(Schema):
    """Дані для створення тегу"""
    name: str

class TagSchema(Schema):
    """Повна інформація про тег"""
    id: UUID
    name: str
    created_at: datetime

# ==================== NOTE SCHEMAS ====================

class NoteCreateSchema(Schema):
    """Дані для створення нотатки"""
    title: str                          # Обов'язково
    content: str                        # Обов'язково
    category_id: Optional[UUID] = None  # Опційно
    tag_ids: Optional[List[UUID]] = []  # Список ID тегів
    is_public: bool = False             # За замовчуванням приватна

class NoteUpdateSchema(Schema):
    """Дані для оновлення нотатки (всі поля опційні)"""
    title: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[UUID] = None
    tag_ids: Optional[List[UUID]] = None
    is_pinned: Optional[bool] = None
    is_archived: Optional[bool] = None
    is_public: Optional[bool] = None

class NoteSchema(Schema):
    """Повна інформація про нотатку (відповідь API)"""
    id: UUID
    title: str
    content: str
    category: Optional[CategorySchema] = None  # Вкладена категорія
    tags: List[TagSchema] = []                 # Список тегів
    is_pinned: bool
    is_archived: bool
    is_public: bool
    created_at: datetime
    updated_at: datetime

class ErrorSchema(Schema):
    """Повідомлення про помилку"""
    detail: str