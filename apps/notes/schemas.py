from ninja import Schema
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel

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
    is_password_protected: bool  # ✅ ДОДАНЕ ПОЛЕ ДЛЯ ПАРОЛЮ!
    inspired_by: Optional[dict] = None
    created_at: datetime
    updated_at: datetime


class NoteRevisionSchema(Schema):
    id: UUID
    created_at: datetime
    title: str
    content_preview: str
    category_id: Optional[str] = None
    tag_ids: List[str] = []
    is_pinned: bool
    is_archived: bool
    is_public: bool


class MoodEntryCreateSchema(BaseModel):
    date: str
    mood: int
    note: Optional[str] = ""


class MoodEntrySchema(Schema):
    id: UUID
    date: str
    mood: int
    note: str
    created_at: datetime
    updated_at: datetime


class ReminderCreateSchema(BaseModel):
    title: str
    description: Optional[str] = ""
    due_at: datetime
    notify_email: bool = True


class ReminderUpdateSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_at: Optional[datetime] = None
    is_done: Optional[bool] = None
    notify_email: Optional[bool] = None


class ReminderSchema(Schema):
    id: UUID
    title: str
    description: str
    due_at: datetime
    is_done: bool
    notify_email: bool
    email_sent_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class ReminderNotificationSchema(Schema):
    id: UUID
    reminder_id: UUID
    message: str
    is_read: bool
    created_at: datetime


class AIAssistRequestSchema(BaseModel):
    title: Optional[str] = ""
    content: str
    instruction: Optional[str] = ""


class AIAssistResponseSchema(Schema):
    assistant_text: str


class AISuggestMetaRequestSchema(BaseModel):
    title: Optional[str] = ""
    content: str


class AISuggestMetaResponseSchema(Schema):
    tags: List[str]
    themes: List[str]


class ErrorSchema(Schema):
    """Повідомлення про помилку"""
    detail: str

# ==================== FILE UPLOAD SCHEMAS ====================

class UploadedFileSchema(Schema):
    name: str
    url: str
    size: int
    content_type: str

# ==================== 🔐 SCHEMAS ДЛЯ ПАРОЛЮ ====================

class NotePasswordCheckSchema(BaseModel):
    """Schema для перевірки паролю нотатки"""
    password: str


class NotePasswordResponse(BaseModel):
    """Відповідь при перевірці паролю"""
    access_granted: bool
    message: str


class NoteCreateWithPasswordSchema(BaseModel):
    """Schema для створення нотатки з паролем"""
    title: str
    content: str
    category_id: Optional[str] = None
    tag_ids: Optional[List[str]] = None
    is_public: bool = False
    password: Optional[str] = None  # ✅ Новий параметр!


class NoteUpdateWithPasswordSchema(BaseModel):
    """Schema для оновлення нотатки (включаючи пароль)"""
    title: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[str] = None
    tag_ids: Optional[List[str]] = None
    is_pinned: Optional[bool] = None
    is_archived: Optional[bool] = None
    is_public: Optional[bool] = None
    password: Optional[str] = None  # Для встановлення нового паролю
    old_password: Optional[str] = None  # Для видалення паролю (потрібна перевірка)
