from ninja import Router
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q, Exists, OuterRef
from typing import List, Optional

from apps.notes.models import Note
from .models import Comment, Like, IdeaChain
from .schemas import (
    CommentCreateSchema, CommentSchema,
    LikeSchema, PublicNoteSchema,
    InspireSchema, ErrorSchema, UserMinimalSchema
)
from apps.users.authentication import JWTAuth

router = Router(tags=["Community"], auth=JWTAuth())

# ==================== HELPER FUNCTIONS ====================

def user_to_minimal(user):
    """Конвертація User в мінімальний словник"""
    return {
        "id": user.id,
        "username": user.username,
        "avatar": user.avatar.url if user.avatar else None,
    }

def note_to_public(note, current_user):
    """Конвертація Note в публічний словник"""
    
    # Перевірка чи поставив лайк поточний користувач
    is_liked = Like.objects.filter(note=note, user=current_user).exists()
    
    # Джерело натхнення
    inspired_by = None
    chain = IdeaChain.objects.filter(inspired_note=note).first()
    if chain:
        inspired_by = {
            "id": chain.original_note.id,
            "title": chain.original_note.title,
            "user": user_to_minimal(chain.original_note.user),
        }
    
    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "user": user_to_minimal(note.user),
        "category": {
            "id": note.category.id,
            "name": note.category.name,
            "color": note.category.color,
        } if note.category else None,
        "tags": [
            {"id": tag.id, "name": tag.name}
            for tag in note.tags.all()
        ],
        "created_at": note.created_at,
        "updated_at": note.updated_at,
        "likes_count": note.likes.count(),
        "comments_count": note.comments.count(),
        "is_liked": is_liked,
        "inspired_by": inspired_by,
    }

# ==================== PUBLIC FEED ====================

@router.get("/feed", response=List[PublicNoteSchema])
def public_feed(request, 
                tag: Optional[str] = None,
                sort_by: str = "recent"):  # recent, popular, trending
    """
    Публічна стрічка нотаток
    
    ?tag=важливо - фільтр по тегу
    ?sort_by=popular - сортування (recent, popular, trending)
    """
    
    # Базовий запит - тільки публічні нотатки
    notes = Note.objects.filter(is_public=True, is_archived=False)
    
    # Фільтр по тегу
    if tag:
        notes = notes.filter(tags__name=tag)
    
    # Анотації для статистики
    notes = notes.annotate(
        likes_count=Count('likes', distinct=True),
        comments_count=Count('comments', distinct=True)
    )
    
    # Сортування
    if sort_by == "popular":
        notes = notes.order_by('-likes_count', '-created_at')
    elif sort_by == "trending":
        # Trending = багато лайків за останні 7 днів
        from datetime import timedelta
        from django.utils import timezone
        week_ago = timezone.now() - timedelta(days=7)
        notes = notes.filter(created_at__gte=week_ago).order_by('-likes_count')
    else:  # recent (за замовчуванням)
        notes = notes.order_by('-created_at')
    
    # Повернути тільки перші 50
    notes = notes[:50]
    
    return [note_to_public(note, request.auth) for note in notes]

@router.get("/feed/{note_id}", response={200: PublicNoteSchema, 404: ErrorSchema})
def get_public_note(request, note_id: str):
    """Отримати одну публічну нотатку"""
    note = get_object_or_404(Note, id=note_id, is_public=True)
    return 200, note_to_public(note, request.auth)

# ==================== COMMENTS ====================

@router.get("/notes/{note_id}/comments", response=List[CommentSchema])
def get_comments(request, note_id: str):
    """Отримати коментарі до нотатки"""
    note = get_object_or_404(Note, id=note_id, is_public=True)
    
    comments = Comment.objects.filter(note=note, parent=None).annotate(
        replies_count=Count('replies')
    )
    
    return [
        {
            "id": c.id,
            "user": user_to_minimal(c.user),
            "content": c.content,
            "parent_id": c.parent_id,  # type: ignore
            "created_at": c.created_at,
            "updated_at": c.updated_at,
            "replies_count": c.replies_count,  # type: ignore
        }
        for c in comments
    ]

@router.post("/notes/{note_id}/comments", response={201: CommentSchema, 400: ErrorSchema})
def create_comment(request, note_id: str, data: CommentCreateSchema):
    """Додати коментар"""
    note = get_object_or_404(Note, id=note_id, is_public=True)
    
    comment = Comment.objects.create(
        note=note,
        user=request.auth,
        content=data.content,
        parent_id=data.parent_id
    )
    
    return 201, {
        "id": comment.id,
        "user": user_to_minimal(comment.user),
        "content": comment.content,
        "parent_id": comment.parent_id,  # type: ignore
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
        "replies_count": 0,
    }

@router.delete("/comments/{comment_id}", response={204: None, 404: ErrorSchema})
def delete_comment(request, comment_id: str):
    """Видалити свій коментар"""
    comment = get_object_or_404(Comment, id=comment_id, user=request.auth)
    comment.delete()
    return 204, None

# ==================== LIKES ====================

@router.post("/notes/{note_id}/like", response={200: dict, 404: ErrorSchema})
def toggle_like(request, note_id: str):
    """Поставити/прибрати лайк (toggle)"""
    note = get_object_or_404(Note, id=note_id, is_public=True)
    
    like, created = Like.objects.get_or_create(note=note, user=request.auth)
    
    if not created:
        # Лайк вже був - видаляємо
        like.delete()
        return 200, {
            "liked": False,
            "likes_count": note.likes.count()
        }
    else:
        # Новий лайк
        return 200, {
            "liked": True,
            "likes_count": note.likes.count()
        }

@router.get("/notes/{note_id}/likes", response=List[LikeSchema])
def get_likes(request, note_id: str):
    """Список користувачів які поставили лайк"""
    note = get_object_or_404(Note, id=note_id, is_public=True)
    
    likes = Like.objects.filter(note=note).select_related('user')
    
    return [
        {
            "id": like.id,
            "user": user_to_minimal(like.user),
            "created_at": like.created_at,
        }
        for like in likes
    ]

# ==================== INSPIRE (Надихнутись) ====================

@router.post("/inspire", response={201: dict, 400: ErrorSchema, 404: ErrorSchema})
def inspire_from_note(request, data: InspireSchema):
    """
    Кнопка "Надихнутись" - створює копію нотатки
    і зберігає ланцюг ідей
    """
    original_note = get_object_or_404(Note, id=data.original_note_id, is_public=True)
    
    # Не можна надихнутись власною нотаткою
    if original_note.user == request.auth:
        return 400, {"detail": "Не можна копіювати власну нотатку"}
    
    # Створити нову нотатку
    new_note = Note.objects.create(
        user=request.auth,
        title=f"💡 {original_note.title}",
        content=original_note.content,
        category=original_note.category,
        is_public=False,  # За замовчуванням приватна
    )
    
    # Скопіювати теги
    new_note.tags.set(original_note.tags.all())
    
    # Створити ланцюг ідей
    IdeaChain.objects.create(
        original_note=original_note,
        inspired_note=new_note
    )
    
    return 201, {
        "message": "Нотатку скопійовано!",
        "note_id": new_note.id
    }

# ==================== IDEA CHAIN ====================

@router.get("/notes/{note_id}/chain", response=List[dict])
def get_idea_chain(request, note_id: str):
    """
    Отримати ланцюг ідей
    Показує всі нотатки надихнуті цією
    """
    note = get_object_or_404(Note, id=note_id, is_public=True)
    
    chains = IdeaChain.objects.filter(original_note=note).select_related('inspired_note__user')
    
    return [
        {
            "id": chain.inspired_note.id,
            "title": chain.inspired_note.title,
            "user": user_to_minimal(chain.inspired_note.user),
            "created_at": chain.created_at,
        }
        for chain in chains
    ]