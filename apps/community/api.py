from datetime import timedelta
from typing import List, Optional

from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.utils import timezone
from ninja import Router

from apps.notes.models import Note
from apps.users.authentication import JWTAuth
from .models import Comment, IdeaChain, Like
from .schemas import (
    CommentCreateSchema,
    CommentSchema,
    ErrorSchema,
    LikeSchema,
    NotePasswordCheckSchema,
    NotePasswordResponse,
    PublicNoteSchema,
)

router = Router(tags=["Community"], auth=JWTAuth())


def user_to_minimal(user):
    return {
        "id": user.id,
        "username": user.username,
        "avatar": user.avatar.url if user.avatar else None,
    }


def note_to_public(note: Note, current_user, reveal_content: bool = False):
    is_liked = Like.objects.filter(note=note, user=current_user).exists()
    is_protected = bool(getattr(note, "is_password_protected", False))

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
        "content": note.content if (not is_protected or reveal_content) else "[Контент захищений паролем]",
        "user": user_to_minimal(note.user),
        "category": {
            "id": note.category.id,
            "name": note.category.name,
            "color": note.category.color,
        }
        if note.category
        else None,
        "tags": [{"id": tag.id, "name": tag.name} for tag in note.tags.all()],
        "created_at": note.created_at,
        "updated_at": note.updated_at,
        "likes_count": note.likes.count(),
        "comments_count": note.comments.count(),
        "is_liked": is_liked,
        "inspired_by": inspired_by,
        "is_password_protected": is_protected,
    }


@router.get("/feed", response=List[PublicNoteSchema])
def public_feed(request, tag: Optional[str] = None, sort_by: str = "recent"):
    notes = Note.objects.filter(is_public=True, is_archived=False)
    if tag:
        notes = notes.filter(tags__name=tag)

    notes = notes.annotate(
        likes_count=Count("likes", distinct=True),
        comments_count=Count("comments", distinct=True),
    )

    if sort_by == "popular":
        notes = notes.order_by("-likes_count", "-created_at")
    elif sort_by == "trending":
        week_ago = timezone.now() - timedelta(days=7)
        notes = notes.filter(created_at__gte=week_ago).order_by("-likes_count")
    else:
        notes = notes.order_by("-created_at")

    return [note_to_public(note, request.auth, reveal_content=False) for note in notes[:50]]


@router.get("/feed/{note_id}", response={200: PublicNoteSchema, 401: ErrorSchema, 404: ErrorSchema})
@router.get("/notes/{note_id}", response={200: PublicNoteSchema, 401: ErrorSchema, 404: ErrorSchema})
def get_public_note(request, note_id: str, password: Optional[str] = None):
    note = get_object_or_404(Note, id=note_id, is_public=True)

    reveal_content = False
    if getattr(note, "is_password_protected", False):
        if not password or not note.check_password(password):
            return 401, {"detail": "Невірний пароль або пароль не вказаний"}
        reveal_content = True

    return 200, note_to_public(note, request.auth, reveal_content=reveal_content)


@router.post("/notes/{note_id}/check-password", response={200: NotePasswordResponse, 401: ErrorSchema, 404: ErrorSchema})
def check_public_note_password(request, note_id: str, data: NotePasswordCheckSchema):
    note = get_object_or_404(Note, id=note_id, is_public=True)

    if not getattr(note, "is_password_protected", False):
        return 200, {"access_granted": True, "message": "Нотатка не захищена паролем"}

    if note.check_password(data.password):
        return 200, {"access_granted": True, "message": "Пароль правильний"}

    return 401, {"detail": "Пароль невірний"}


@router.get("/notes/{note_id}/comments", response=List[CommentSchema])
def get_comments(request, note_id: str):
    note = get_object_or_404(Note, id=note_id, is_public=True)
    comments = Comment.objects.filter(note=note, parent=None).annotate(replies_count=Count("replies"))
    return [
        {
            "id": c.id,
            "user": user_to_minimal(c.user),
            "content": c.content,
            "parent_id": c.parent_id,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
            "replies_count": c.replies_count,
        }
        for c in comments
    ]


@router.post("/notes/{note_id}/comments", response={201: CommentSchema, 400: ErrorSchema})
def create_comment(request, note_id: str, data: CommentCreateSchema):
    note = get_object_or_404(Note, id=note_id, is_public=True)
    comment = Comment.objects.create(
        note=note,
        user=request.auth,
        content=data.content,
        parent_id=data.parent_id,
    )
    return 201, {
        "id": comment.id,
        "user": user_to_minimal(comment.user),
        "content": comment.content,
        "parent_id": comment.parent_id,
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
        "replies_count": 0,
    }


@router.delete("/comments/{comment_id}", response={204: None, 404: ErrorSchema})
def delete_comment(request, comment_id: str):
    comment = get_object_or_404(Comment, id=comment_id, user=request.auth)
    comment.delete()
    return 204, None


@router.post("/notes/{note_id}/like", response={200: dict, 404: ErrorSchema})
def toggle_like(request, note_id: str):
    note = get_object_or_404(Note, id=note_id, is_public=True)
    like, created = Like.objects.get_or_create(note=note, user=request.auth)
    if not created:
        like.delete()
        return 200, {"liked": False, "likes_count": note.likes.count()}
    return 200, {"liked": True, "likes_count": note.likes.count()}


@router.get("/notes/{note_id}/likes", response=List[LikeSchema])
def get_likes(request, note_id: str):
    note = get_object_or_404(Note, id=note_id, is_public=True)
    likes = Like.objects.filter(note=note).select_related("user")
    return [
        {
            "id": like.id,
            "user": user_to_minimal(like.user),
            "created_at": like.created_at,
        }
        for like in likes
    ]


@router.post("/notes/{note_id}/inspire", response={201: dict, 400: ErrorSchema, 401: ErrorSchema, 404: ErrorSchema})
def inspire_from_note(request, note_id: str, password: Optional[str] = None):
    original_note = get_object_or_404(Note, id=note_id, is_public=True)

    if getattr(original_note, "is_password_protected", False):
        if not password or not original_note.check_password(password):
            return 401, {"detail": "Невірний пароль або пароль не вказаний"}

    if original_note.user == request.auth:
        return 400, {"detail": "Не можна копіювати власну нотатку"}

    new_note = Note.objects.create(
        user=request.auth,
        title=f"💡 {original_note.title}",
        content=original_note.content,
        category=original_note.category,
        is_public=False,
    )
    new_note.tags.set(original_note.tags.all())

    IdeaChain.objects.create(original_note=original_note, inspired_note=new_note)

    return 201, {"message": "Нотатку скопійовано!", "note_id": new_note.id}


@router.get("/notes/{note_id}/chain", response=List[dict])
def get_idea_chain(request, note_id: str):
    note = get_object_or_404(Note, id=note_id, is_public=True)
    chains = IdeaChain.objects.filter(original_note=note).select_related("inspired_note__user")
    return [
        {
            "id": chain.inspired_note.id,
            "title": chain.inspired_note.title,
            "user": user_to_minimal(chain.inspired_note.user),
            "created_at": chain.created_at,
        }
        for chain in chains
    ]
