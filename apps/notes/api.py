from ninja import Router
from django.shortcuts import get_object_or_404
from typing import List
from .models import Note, Category, Tag
from .schemas import *
from apps.users.authentication import JWTAuth

# Створюємо роутер (всі endpoint будуть /api/notes/...)
router = Router(tags=["Notes"], auth=JWTAuth())  # JWT авторизація для всіх

# ==================== CATEGORIES API ====================

@router.get("/categories", response=List[CategorySchema])
def list_categories(request):
    """
    GET /api/notes/categories
    Повертає список всіх категорій користувача
    """
    categories = Category.objects.filter(user=request.auth)  # request.auth = User (з JWT)
    return categories  # Django Ninja автоматично серіалізує в JSON

@router.post("/categories", response={201: CategorySchema, 400: ErrorSchema})
def create_category(request, data: CategoryCreateSchema):
    """
    POST /api/notes/categories
    Body: { "name": "Робота", "color": "#ff0000" }
    
    Створює нову категорію
    """
    # Перевірка унікальності
    if Category.objects.filter(user=request.auth, name=data.name).exists():
        return 400, {"detail": "Категорія з такою назвою вже існує"}
    
    # Створення
    category = Category.objects.create(
        user=request.auth,
        name=data.name,
        color=data.color
    )
    return 201, category  # 201 = Created

@router.delete("/categories/{category_id}", response={204: None, 404: ErrorSchema})
def delete_category(request, category_id: str):
    """
    DELETE /api/notes/categories/{id}
    
    Видаляє категорію
    """
    category = get_object_or_404(Category, id=category_id, user=request.auth)
    category.delete()
    return 204, None  # 204 = No Content (успішно видалено)

# ==================== TAGS API ====================

@router.get("/tags", response=List[TagSchema])
def list_tags(request):
    """GET /api/notes/tags"""
    tags = Tag.objects.filter(user=request.auth)
    return tags

@router.post("/tags", response={201: TagSchema, 400: ErrorSchema})
def create_tag(request, data: TagCreateSchema):
    """POST /api/notes/tags"""
    tag, created = Tag.objects.get_or_create(
        user=request.auth,
        name=data.name
    )
    if not created:
        return 400, {"detail": "Тег з такою назвою вже існує"}
    return 201, tag

# ==================== NOTES API ====================

@router.get("/notes", response=List[NoteSchema])
def list_notes(request, 
                archived: bool = False,      # Query параметр ?archived=true
                pinned: bool = None,         # ?pinned=true
                category_id: str = None):    # ?category_id=uuid
    """
    GET /api/notes/notes
    GET /api/notes/notes?archived=true
    GET /api/notes/notes?category_id=uuid
    
    Список нотаток з фільтрацією
    """
    notes = Note.objects.filter(user=request.auth, is_archived=archived)
    
    if pinned is not None:
        notes = notes.filter(is_pinned=pinned)
    
    if category_id:
        notes = notes.filter(category_id=category_id)
    
    return notes

@router.get("/notes/{note_id}", response={200: NoteSchema, 404: ErrorSchema})
def get_note(request, note_id: str):
    """
    GET /api/notes/notes/{id}
    
    Отримати одну нотатку
    """
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    return note

@router.post("/notes", response={201: NoteSchema, 400: ErrorSchema})
def create_note(request, data: NoteCreateSchema):
    """
    POST /api/notes/notes
    Body: {
        "title": "Заголовок",
        "content": "<p>HTML контент</p>",
        "category_id": "uuid",
        "tag_ids": ["uuid1", "uuid2"],
        "is_public": false
    }
    
    Створює нову нотатку
    """
    try:
        # Створення нотатки
        note = Note.objects.create(
            user=request.auth,
            title=data.title,
            content=data.content,
            category_id=data.category_id,
            is_public=data.is_public
        )
        
        # Додавання тегів (ManyToMany)
        if data.tag_ids:
            tags = Tag.objects.filter(id__in=data.tag_ids, user=request.auth)
            note.tags.set(tags)  # set() для ManyToMany
        
        return 201, note
    except Exception as e:
        return 400, {"detail": str(e)}

@router.put("/notes/{note_id}", response={200: NoteSchema, 404: ErrorSchema, 400: ErrorSchema})
def update_note(request, note_id: str, data: NoteUpdateSchema):
    """
    PUT /api/notes/notes/{id}
    Body: {
        "title": "Новий заголовок",
        "content": "Новий контент"
    }
    
    Оновлює нотатку (тільки надіслані поля)
    """
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    
    try:
        # Оновлюємо тільки надіслані поля
        if data.title is not None:
            note.title = data.title
        if data.content is not None:
            note.content = data.content
        if data.category_id is not None:
            note.category_id = data.category_id
        if data.is_pinned is not None:
            note.is_pinned = data.is_pinned
        if data.is_archived is not None:
            note.is_archived = data.is_archived
        if data.is_public is not None:
            note.is_public = data.is_public
        
        note.save()  # Збереження в БД
        
        # Оновлення тегів
        if data.tag_ids is not None:
            tags = Tag.objects.filter(id__in=data.tag_ids, user=request.auth)
            note.tags.set(tags)
        
        return 200, note
    except Exception as e:
        return 400, {"detail": str(e)}

@router.delete("/notes/{note_id}", response={204: None, 404: ErrorSchema})
def delete_note(request, note_id: str):
    """DELETE /api/notes/notes/{id}"""
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    note.delete()
    return 204, None

@router.post("/notes/{note_id}/pin", response={200: NoteSchema, 404: ErrorSchema})
def pin_note(request, note_id: str):
    """
    POST /api/notes/notes/{id}/pin
    
    Закріпити/відкріпити нотатку (toggle)
    """
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    note.is_pinned = not note.is_pinned  # Toggle
    note.save()
    return note

@router.post("/notes/{note_id}/archive", response={200: NoteSchema, 404: ErrorSchema})
def archive_note(request, note_id: str):
    """POST /api/notes/notes/{id}/archive"""
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    note.is_archived = not note.is_archived
    note.save()
    return note