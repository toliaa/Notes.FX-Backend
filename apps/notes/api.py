import re
from datetime import date
import logging
import json
from ninja import Router
from django.shortcuts import get_object_or_404
from typing import List
from uuid import uuid4
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from django.core.files.storage import default_storage
from django.core.mail import send_mail
from django.core.cache import cache
from django.utils import timezone
from django.conf import settings
from .models import Note, Category, Tag, NoteRevision, MoodEntry, Reminder, ReminderNotification
from .schemas import *
from apps.users.authentication import JWTAuth

# Створюємо роутер (всі endpoint будуть /api/notes/...)
router = Router(tags=["Notes"], auth=JWTAuth())  # JWT авторизація для всіх

MAX_UPLOAD_SIZE = 25 * 1024 * 1024  # 25 MB per file
MAX_TAGS_PER_USER = 5
MAX_NOTE_REVISIONS_PER_NOTE = 30
MAX_HISTORY_RESPONSE_ITEMS = 20
logger = logging.getLogger(__name__)


def note_to_response(note: Note):
    from apps.community.models import IdeaChain

    inspired_by = None
    chain = IdeaChain.objects.filter(inspired_note=note).select_related("original_note__user").first()
    if chain:
        inspired_by = {
            "id": chain.original_note.id,
            "title": chain.original_note.title,
            "user": {
                "id": chain.original_note.user.id,
                "username": chain.original_note.user.username,
                "avatar": chain.original_note.user.avatar.url if chain.original_note.user.avatar else None,
            },
        }

    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "category": {
            "id": note.category.id,
            "name": note.category.name,
            "color": note.category.color,
            "created_at": note.category.created_at,
        }
        if note.category
        else None,
        "tags": [
            {
                "id": tag.id,
                "name": tag.name,
                "created_at": tag.created_at,
            }
            for tag in note.tags.all()
        ],
        "is_pinned": note.is_pinned,
        "is_archived": note.is_archived,
        "is_public": note.is_public,
        "is_password_protected": note.is_password_protected,
        "inspired_by": inspired_by,
        "created_at": note.created_at,
        "updated_at": note.updated_at,
    }


def build_note_snapshot(note: Note) -> dict:
    return {
        "title": note.title,
        "content": note.content,
        "category_id": str(note.category_id) if note.category_id else None,
        "tag_ids": sorted([str(tag_id) for tag_id in note.tags.values_list("id", flat=True)]),
        "is_pinned": note.is_pinned,
        "is_archived": note.is_archived,
        "is_public": note.is_public,
    }


def build_history_preview(content: str) -> str:
    if not content:
        return ""
    without_attachments = re.sub(
        r'<(figure|a)[^>]*class=["\'][^"\']*note-attachment[^"\']*["\'][^>]*>[\s\S]*?</\1>',
        " ",
        content,
        flags=re.IGNORECASE,
    )
    without_html = re.sub(r"<[^>]+>", " ", without_attachments)
    normalized = re.sub(r"\s+", " ", without_html).strip()
    return normalized[:140]


def create_note_revision(note: Note, user, snapshot: dict):
    latest = NoteRevision.objects.filter(note=note, user=user).order_by("-created_at").first()
    if latest and latest.snapshot == snapshot:
        return

    NoteRevision.objects.create(
        note=note,
        user=user,
        snapshot=snapshot,
    )

    revision_ids = list(
        NoteRevision.objects.filter(note=note, user=user)
        .order_by("-created_at")
        .values_list("id", flat=True)
    )
    if len(revision_ids) > MAX_NOTE_REVISIONS_PER_NOTE:
        stale_ids = revision_ids[MAX_NOTE_REVISIONS_PER_NOTE:]
        NoteRevision.objects.filter(id__in=stale_ids).delete()


def maybe_send_reminder_email(reminder: Reminder):
    if not reminder.notify_email or reminder.email_sent_at is not None:
        return

    # Send only when reminder is due.
    if reminder.due_at > timezone.now():
        return

    user_email = getattr(reminder.user, "email", None)
    if not user_email:
        return

    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@notesfx.local")

    try:
        sent_count = send_mail(
            subject=f"Reminder: {reminder.title}",
            message=f"Reminder due at {reminder.due_at.isoformat()}\n\n{reminder.description}",
            from_email=from_email,
            recipient_list=[user_email],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Failed to send reminder email for reminder_id=%s", reminder.id)
        return

    if sent_count > 0:
        reminder.email_sent_at = timezone.now()
        reminder.save(update_fields=["email_sent_at"])


def strip_html_for_ai(value: str) -> str:
    if not value:
        return ""
    without_tags = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", without_tags).strip()


def enforce_ai_cooldown(request, action: str):
    min_interval = int(getattr(settings, "AI_MIN_INTERVAL_SECONDS", 15))
    if min_interval <= 0:
        return None

    user_id = getattr(getattr(request, "auth", None), "id", None) or "anon"
    cache_key = f"ai:cooldown:{action}:{user_id}"
    if cache.get(cache_key):
        return f"Too many AI requests. Please wait {min_interval} seconds and try again."

    cache.set(cache_key, True, timeout=min_interval)
    return None


def call_openai_json(system_prompt: str, user_prompt: str):
    api_key = getattr(settings, "OPENAI_API_KEY", "") or ""
    model = getattr(settings, "OPENAI_MODEL", "gpt-4.1-mini")
    if not api_key:
        return None, "OPENAI_API_KEY is not configured"

    payload = {
        "model": model,
        "input": [
            {"role": "system", "content": [{"type": "input_text", "text": system_prompt}]},
            {"role": "user", "content": [{"type": "input_text", "text": user_prompt}]},
        ],
        "text": {"format": {"type": "json_object"}},
        "max_output_tokens": 700,
    }

    req = Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(req, timeout=30) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except HTTPError:
        logger.exception("OpenAI HTTP error")
        return None, "AI provider rejected request"
    except URLError:
        logger.exception("OpenAI network error")
        return None, "AI provider is unreachable"
    except Exception:
        logger.exception("OpenAI request failed")
        return None, "AI request failed"

    output_text = raw.get("output_text")
    if not output_text:
        output_text = ""
        for item in raw.get("output", []):
            for part in item.get("content", []):
                text = part.get("text")
                if isinstance(text, str):
                    output_text += text

    if not output_text:
        return None, "AI returned empty output"

    try:
        return json.loads(output_text), None
    except json.JSONDecodeError:
        logger.exception("Invalid JSON from AI: %s", output_text)
        return None, "AI returned invalid JSON"


def call_ollama_json(system_prompt: str, user_prompt: str):
    base_url = getattr(settings, "OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
    model = getattr(settings, "OLLAMA_MODEL", "qwen2.5:7b-instruct")
    prompt = (
        f"{system_prompt}\n\n"
        f"{user_prompt}\n\n"
        "Output must be strict JSON only."
    )

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": "json",
    }

    req = Request(
        f"{base_url}/api/generate",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urlopen(req, timeout=90) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except HTTPError:
        logger.exception("Ollama HTTP error")
        return None, "Ollama rejected request"
    except URLError:
        logger.exception("Ollama network error")
        return None, "Ollama is unreachable"
    except Exception:
        logger.exception("Ollama request failed")
        return None, "Ollama request failed"

    output_text = str(raw.get("response", "")).strip()
    if not output_text:
        return None, "Ollama returned empty output"

    try:
        return json.loads(output_text), None
    except json.JSONDecodeError:
        logger.exception("Invalid JSON from Ollama: %s", output_text)
        return None, "Ollama returned invalid JSON"


def call_gemini_json(system_prompt: str, user_prompt: str):
    api_key = getattr(settings, "GEMINI_API_KEY", "") or ""
    model = getattr(settings, "GEMINI_MODEL", "gemini-3-flash")
    configured_fallbacks = str(
        getattr(
            settings,
            "GEMINI_FALLBACK_MODELS",
            "gemini-3-flash,gemini-2-flash-exp,gemini-2.5-flash-lite,gemini-2-flash,gemini-2.0-flash,gemini-2.5-flash",
        )
    )
    if not api_key:
        return None, "GEMINI_API_KEY is not configured"

    prompt_text = (
        f"{system_prompt}\n\n{user_prompt}\n\n"
        "Output must be strict JSON only."
    )

    def normalize_model_name(name: str) -> str:
        value = (name or "").strip()
        if not value:
            return "models/gemini-2.0-flash"
        return value if value.startswith("models/") else f"models/{value}"

    def pick_fallback_models() -> list[str]:
        try:
            req = Request(
                f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}",
                headers={"Content-Type": "application/json"},
                method="GET",
            )
            with urlopen(req, timeout=20) as response:
                raw = json.loads(response.read().decode("utf-8"))
        except Exception:
            logger.exception("Failed to list Gemini models")
            return []

        models = raw.get("models", [])
        candidates: list[str] = []
        for item in models:
            methods = item.get("supportedGenerationMethods", [])
            name = item.get("name")
            if not isinstance(name, str):
                continue
            if "generateContent" not in methods:
                continue
            candidates.append(name)

        if not candidates:
            return []

        configured = [
            normalize_model_name(item)
            for item in configured_fallbacks.split(",")
            if item.strip()
        ]
        ordered: list[str] = []
        # Prefer explicitly configured fallbacks first (including preview/exp models).
        for preferred in configured:
            if preferred in candidates:
                ordered.append(preferred)
        # Safety defaults if no configured model is available.
        for preferred in (
            "models/gemini-3-flash",
            "models/gemini-2-flash-exp",
            "models/gemini-2.5-flash-lite",
            "models/gemini-2-flash",
            "models/gemini-2.0-flash",
            "models/gemini-2.5-flash",
            "models/gemini-1.5-flash",
        ):
            if preferred in candidates and preferred not in ordered:
                ordered.append(preferred)
        for candidate in candidates:
            if candidate not in ordered:
                ordered.append(candidate)
        return ordered

    def extract_http_error_message(exc: HTTPError) -> str:
        body = ""
        try:
            body = exc.read().decode("utf-8")
        except Exception:
            body = ""
        message = f"Gemini HTTP {exc.code}"
        try:
            parsed = json.loads(body) if body else {}
            api_message = parsed.get("error", {}).get("message")
            if isinstance(api_message, str) and api_message.strip():
                message = api_message.strip()
        except Exception:
            pass
        return message

    def request_gemini(target_model: str, with_json_mime: bool):
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt_text}],
                }
            ],
        }
        if with_json_mime:
            payload["generationConfig"] = {"responseMimeType": "application/json"}

        req = Request(
            f"https://generativelanguage.googleapis.com/v1beta/{target_model}:generateContent?key={api_key}",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))

    target_model = normalize_model_name(model)

    try:
        raw = request_gemini(target_model=target_model, with_json_mime=True)
    except HTTPError as exc:
        message = extract_http_error_message(exc)

        # 404 usually means wrong/retired model. Resolve a valid one and retry once.
        if exc.code == 404:
            fallbacks = pick_fallback_models()
            if fallbacks:
                target_model = fallbacks[0]
                try:
                    raw = request_gemini(target_model=target_model, with_json_mime=True)
                except HTTPError as second_exc:
                    logger.exception("Gemini HTTP error after model fallback")
                    return None, extract_http_error_message(second_exc)
                except URLError:
                    logger.exception("Gemini network error after model fallback")
                    return None, "Gemini is unreachable"
                except Exception:
                    logger.exception("Gemini request failed after model fallback")
                    return None, "Gemini request failed"
            else:
                logger.exception("Gemini model not found and no fallback available")
                return None, message
        # Some models/configs reject responseMimeType; retry once without it.
        elif exc.code == 400:
            try:
                raw = request_gemini(target_model=target_model, with_json_mime=False)
            except HTTPError as second_exc:
                logger.exception("Gemini HTTP error after retry")
                return None, extract_http_error_message(second_exc)
            except URLError:
                logger.exception("Gemini network error after retry")
                return None, "Gemini is unreachable"
            except Exception:
                logger.exception("Gemini request failed after retry")
                return None, "Gemini request failed"
        # 429: try alternative models with separate quotas.
        elif exc.code == 429:
            fallbacks = [m for m in pick_fallback_models() if m != target_model]
            for fallback_model in fallbacks[:3]:
                try:
                    raw = request_gemini(target_model=fallback_model, with_json_mime=True)
                    target_model = fallback_model
                    break
                except HTTPError as retry_exc:
                    if retry_exc.code != 429:
                        return None, extract_http_error_message(retry_exc)
                    continue
                except URLError:
                    return None, "Gemini is unreachable"
                except Exception:
                    return None, "Gemini request failed"
            else:
                logger.exception("Gemini rate limited across fallback models")
                return None, "Gemini HTTP 429: free-tier quota/rate limit reached. Wait and retry."
        else:
            logger.exception("Gemini HTTP error")
            return None, message
    except URLError:
        logger.exception("Gemini network error")
        return None, "Gemini is unreachable"
    except Exception:
        logger.exception("Gemini request failed")
        return None, "Gemini request failed"

    candidates = raw.get("candidates", [])
    if not candidates:
        feedback = raw.get("promptFeedback", {})
        block_reason = feedback.get("blockReason")
        if block_reason:
            return None, f"Gemini blocked request: {block_reason}"
        logger.exception("Unexpected Gemini response: %s", raw)
        return None, "Gemini returned no candidates"

    output_text = ""
    for part in candidates[0].get("content", {}).get("parts", []):
        text = part.get("text")
        if isinstance(text, str):
            output_text += text

    if not output_text:
        return None, "Gemini returned empty output"

    try:
        return json.loads(output_text), None
    except json.JSONDecodeError:
        logger.exception("Invalid JSON from Gemini: %s", output_text)
        return None, "Gemini returned invalid JSON"


def call_ai_json(system_prompt: str, user_prompt: str):
    provider = getattr(settings, "AI_PROVIDER", "gemini").lower()
    if provider == "gemini":
        return call_gemini_json(system_prompt, user_prompt)
    if provider == "openai":
        return call_openai_json(system_prompt, user_prompt)
    if provider == "ollama":
        return call_ollama_json(system_prompt, user_prompt)
    return None, f"Unsupported AI provider: {provider}"


@router.post("/ai/assist", response={200: AIAssistResponseSchema, 400: ErrorSchema, 429: ErrorSchema, 500: ErrorSchema})
def ai_assist(request, data: AIAssistRequestSchema):
    cooldown_error = enforce_ai_cooldown(request, "assist")
    if cooldown_error:
        return 429, {"detail": cooldown_error}

    plain_text = strip_html_for_ai(data.content or "")
    if not plain_text:
        return 400, {"detail": "Content is required"}

    instruction = (data.instruction or "").strip() or "Continue this note with helpful, concise text."
    system_prompt = (
        "You are a writing assistant for personal notes. "
        "Return strict JSON with one key: assistant_text."
    )
    user_prompt = (
        f"Title: {data.title or ''}\n"
        f"Instruction: {instruction}\n"
        f"Note text:\n{plain_text[:5000]}\n\n"
        "Return JSON: {\"assistant_text\": \"...\"}"
    )

    result, error = call_ai_json(system_prompt, user_prompt)
    if error:
        if "429" in error:
            return 429, {"detail": error}
        return 500, {"detail": error}

    assistant_text = str(result.get("assistant_text", "")).strip()[:4000]
    if not assistant_text:
        return 500, {"detail": "AI returned empty assistant_text"}

    return 200, {"assistant_text": assistant_text}


@router.post("/ai/suggest-meta", response={200: AISuggestMetaResponseSchema, 400: ErrorSchema, 429: ErrorSchema, 500: ErrorSchema})
def ai_suggest_meta(request, data: AISuggestMetaRequestSchema):
    cooldown_error = enforce_ai_cooldown(request, "suggest_meta")
    if cooldown_error:
        return 429, {"detail": cooldown_error}

    plain_text = strip_html_for_ai(data.content or "")
    if not plain_text:
        return 400, {"detail": "Content is required"}

    system_prompt = (
        "You suggest metadata for notes. "
        "Return strict JSON with keys tags and themes; arrays of short strings."
    )
    user_prompt = (
        f"Title: {data.title or ''}\n"
        f"Note text:\n{plain_text[:5000]}\n\n"
        "Return JSON exactly like: "
        "{\"tags\": [\"tag1\", \"tag2\"], \"themes\": [\"theme1\", \"theme2\"]}. "
        "Up to 5 tags and 5 themes."
    )

    result, error = call_ai_json(system_prompt, user_prompt)
    if error:
        if "429" in error:
            return 429, {"detail": error}
        return 500, {"detail": error}

    def normalize(values):
        if not isinstance(values, list):
            return []
        normalized = []
        seen = set()
        for value in values:
            text = str(value).strip()
            if not text:
                continue
            key = text.lower()
            if key in seen:
                continue
            seen.add(key)
            normalized.append(text[:40])
            if len(normalized) >= 5:
                break
        return normalized

    return 200, {
        "tags": normalize(result.get("tags", [])),
        "themes": normalize(result.get("themes", [])),
    }

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
    if Tag.objects.filter(user=request.auth, name=data.name).exists():
        return 400, {"detail": "Tag with this name already exists"}

    if Tag.objects.filter(user=request.auth).count() >= MAX_TAGS_PER_USER:
        return 400, {"detail": f"Maximum {MAX_TAGS_PER_USER} tags per user"}

    tag, created = Tag.objects.get_or_create(
        user=request.auth,
        name=data.name
    )
    if not created:
        return 400, {"detail": "Tag with this name already exists"}
    return 201, tag


@router.get("/tags/{tag_id}", response={200: TagSchema, 404: ErrorSchema})
def get_tag(request, tag_id: str):
    tag = get_object_or_404(Tag, id=tag_id, user=request.auth)
    return 200, tag


@router.put("/tags/{tag_id}", response={200: TagSchema, 400: ErrorSchema, 404: ErrorSchema})
def update_tag(request, tag_id: str, data: TagCreateSchema):
    tag = get_object_or_404(Tag, id=tag_id, user=request.auth)
    new_name = data.name.strip()
    if not new_name:
        return 400, {"detail": "Tag name is required"}
    if Tag.objects.filter(user=request.auth, name=new_name).exclude(id=tag.id).exists():
        return 400, {"detail": "Tag with this name already exists"}
    tag.name = new_name
    tag.save(update_fields=["name"])
    return 200, tag


@router.delete("/tags/{tag_id}", response={204: None, 404: ErrorSchema})
def delete_tag(request, tag_id: str):
    tag = get_object_or_404(Tag, id=tag_id, user=request.auth)
    tag.delete()
    return 204, None


@router.post("/uploads", response={200: List[UploadedFileSchema], 400: ErrorSchema})
def upload_files(request):
    files = request.FILES.getlist("files")
    if not files:
        return 400, {"detail": "No files provided"}

    uploaded_files = []
    for file in files:
        if file.size > MAX_UPLOAD_SIZE:
            return 400, {"detail": f"File '{file.name}' exceeds 25MB limit"}

        ext = Path(file.name).suffix
        safe_name = f"{uuid4().hex}{ext}"
        relative_path = f"notes_uploads/{request.auth.id}/{safe_name}"
        saved_path = default_storage.save(relative_path, file)

        uploaded_files.append({
            "name": file.name,
            "url": request.build_absolute_uri(f"/media/{saved_path}"),
            "size": file.size,
            "content_type": getattr(file, "content_type", "application/octet-stream"),
        })

    return 200, uploaded_files

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
    
    notes = notes.select_related("category").prefetch_related("tags")
    return [note_to_response(note) for note in notes]

@router.get("/notes/{note_id}", response={200: NoteSchema, 404: ErrorSchema, 403: ErrorSchema})
def get_note(request, note_id: str):
    """
    GET /api/notes/notes/{id}
    
    Отримати одну нотатку
    Якщо нотатка захищена паролем - повертаємо лише основні дані без контенту
    """
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    
    # Якщо нотатка захищена паролем, не показуємо контент
    if note.is_password_protected:
        # Повертаємо обмежені дані
        return {
            "id": note.id,
            "title": note.title,
            "content": "[Контент захищений паролем]",
            "is_password_protected": True,
            "is_pinned": note.is_pinned,
            "is_archived": note.is_archived,
            "is_public": note.is_public,
            "created_at": note.created_at,
            "updated_at": note.updated_at,
        }
    
    return note

@router.post("/notes", response={201: NoteSchema, 400: ErrorSchema})
def create_note(request, data: NoteCreateWithPasswordSchema):
    """
    POST /api/notes/notes
    Body: {
        "title": "Заголовок",
        "content": "<p>HTML контент</p>",
        "category_id": "uuid",
        "tag_ids": ["uuid1", "uuid2"],
        "is_public": false,
        "password": "my_password"  # Новий параметр (опціональний)
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
        
        # Встановлюємо пароль, якщо надано
        if data.password:
            note.set_password(data.password)
        
        note.save()
        
        # Додавання тегів (ManyToMany)
        if data.tag_ids and len(data.tag_ids) > MAX_TAGS_PER_USER:
            return 400, {"detail": f"Максимум {MAX_TAGS_PER_USER} тегів для нотатки"}

        if data.tag_ids:
            tags = Tag.objects.filter(id__in=data.tag_ids, user=request.auth)
            note.tags.set(tags)  # set() для ManyToMany
        
        return 201, note
    except Exception as e:
        return 400, {"detail": str(e)}

@router.put("/notes/{note_id}", response={200: NoteSchema, 404: ErrorSchema, 400: ErrorSchema, 401: ErrorSchema})
def update_note(request, note_id: str, data: NoteUpdateWithPasswordSchema):
    """
    PUT /api/notes/notes/{id}
    Body: {
        "title": "Новий заголовок",
        "content": "Новий контент",
        "password": "new_password",  # Встановити новий пароль
        "old_password": "old_password"  # Видалити пароль (потрібна перевірка)
    }
    
    Оновлює нотатку (тільки надіслані поля)
    """
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    old_snapshot = build_note_snapshot(note)
    
    try:
        # ========== ОБРОБКА ПАРОЛЮ ==========
        
        # Якщо користувач хоче видалити пароль - потрібна перевірка старого паролю
        if data.old_password is not None:
            if not note.is_password_protected:
                return 400, {"detail": "Нотатка не захищена паролем"}
            
            if not note.check_password(data.old_password):
                return 401, {"detail": "Старий пароль невірний"}
            
            note.clear_password()
        
        # Встановлення нового паролю
        if data.password is not None:
            note.set_password(data.password)
        
        # ========== ОБРОБКА ІНШИХ ПОЛІВ ==========
        
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
            if len(data.tag_ids) > MAX_TAGS_PER_USER:
                return 400, {"detail": f"Максимум {MAX_TAGS_PER_USER} тегів для нотатки"}
            tags = Tag.objects.filter(id__in=data.tag_ids, user=request.auth)
            note.tags.set(tags)

        if old_snapshot != build_note_snapshot(note):
            create_note_revision(note, request.auth, old_snapshot)
        
        return 200, note
    except Exception as e:
        return 400, {"detail": str(e)}


@router.get("/notes/{note_id}/history", response=List[NoteRevisionSchema])
def get_note_history(request, note_id: str):
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    revisions = NoteRevision.objects.filter(note=note, user=request.auth)[:MAX_HISTORY_RESPONSE_ITEMS]
    return [
        {
            "id": revision.id,
            "created_at": revision.created_at,
            "title": revision.snapshot.get("title", ""),
            "content_preview": build_history_preview(revision.snapshot.get("content", "") or ""),
            "category_id": revision.snapshot.get("category_id"),
            "tag_ids": revision.snapshot.get("tag_ids", []),
            "is_pinned": bool(revision.snapshot.get("is_pinned", False)),
            "is_archived": bool(revision.snapshot.get("is_archived", False)),
            "is_public": bool(revision.snapshot.get("is_public", False)),
        }
        for revision in revisions
    ]


@router.post("/notes/{note_id}/history/{revision_id}/restore", response={200: NoteSchema, 404: ErrorSchema})
def restore_note_revision(request, note_id: str, revision_id: str):
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    revision = get_object_or_404(NoteRevision, id=revision_id, note=note, user=request.auth)
    snapshot = revision.snapshot or {}
    current_snapshot = build_note_snapshot(note)

    target_snapshot = {
        "title": snapshot.get("title", note.title),
        "content": snapshot.get("content", note.content),
        "category_id": snapshot.get("category_id"),
        "tag_ids": sorted(snapshot.get("tag_ids", [])),
        "is_pinned": bool(snapshot.get("is_pinned", note.is_pinned)),
        "is_archived": bool(snapshot.get("is_archived", note.is_archived)),
        "is_public": bool(snapshot.get("is_public", note.is_public)),
    }

    if current_snapshot == target_snapshot:
        return 200, note

    create_note_revision(note, request.auth, current_snapshot)

    note.title = target_snapshot["title"]
    note.content = target_snapshot["content"]
    note.category_id = target_snapshot["category_id"]
    note.is_pinned = target_snapshot["is_pinned"]
    note.is_archived = target_snapshot["is_archived"]
    note.is_public = target_snapshot["is_public"]
    note.save()

    tag_ids = target_snapshot["tag_ids"]
    tags = Tag.objects.filter(id__in=tag_ids, user=request.auth)
    note.tags.set(tags)

    return 200, note

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

# ==================== ПАРОЛЮВАННЯ API ====================

@router.get("/moods", response=List[MoodEntrySchema])
def list_moods(request, month: str = None):
    moods = MoodEntry.objects.filter(user=request.auth)
    if month:
        moods = moods.filter(date__startswith=month)
    return [
        {
            "id": mood.id,
            "date": mood.date.isoformat(),
            "mood": mood.mood,
            "note": mood.note,
            "created_at": mood.created_at,
            "updated_at": mood.updated_at,
        }
        for mood in moods
    ]


@router.post("/moods", response={201: MoodEntrySchema, 400: ErrorSchema})
def upsert_mood(request, data: MoodEntryCreateSchema):
    try:
        mood_date = date.fromisoformat(data.date)
    except Exception:
        return 400, {"detail": "Invalid date format. Use YYYY-MM-DD"}

    if data.mood < 1 or data.mood > 5:
        return 400, {"detail": "Mood must be between 1 and 5"}

    mood, _ = MoodEntry.objects.update_or_create(
        user=request.auth,
        date=mood_date,
        defaults={"mood": data.mood, "note": data.note or ""},
    )
    return 201, {
        "id": mood.id,
        "date": mood.date.isoformat(),
        "mood": mood.mood,
        "note": mood.note,
        "created_at": mood.created_at,
        "updated_at": mood.updated_at,
    }


@router.get("/reminders", response=List[ReminderSchema])
def list_reminders(request, include_done: bool = False):
    reminders = Reminder.objects.filter(user=request.auth)
    if not include_done:
        reminders = reminders.filter(is_done=False)
    return reminders.order_by("is_done", "due_at")


@router.post("/reminders", response={201: ReminderSchema, 400: ErrorSchema})
def create_reminder(request, data: ReminderCreateSchema):
    if not data.title.strip():
        return 400, {"detail": "Title is required"}

    reminder = Reminder.objects.create(
        user=request.auth,
        title=data.title.strip(),
        description=(data.description or "").strip(),
        due_at=data.due_at,
        notify_email=data.notify_email,
    )
    ReminderNotification.objects.create(
        user=request.auth,
        reminder=reminder,
        message=f"Reminder created: {reminder.title}",
    )
    maybe_send_reminder_email(reminder)
    return 201, reminder


@router.post("/reminders/dispatch", response={200: dict})
def dispatch_due_reminders(request):
    now = timezone.now()
    due_reminders = Reminder.objects.filter(
        user=request.auth,
        is_done=False,
        due_at__lte=now,
    ).order_by("due_at")

    created = 0
    for reminder in due_reminders:
        exists = ReminderNotification.objects.filter(
            user=request.auth,
            reminder=reminder,
            message__startswith="Reminder due:",
        ).exists()
        if not exists:
            ReminderNotification.objects.create(
                user=request.auth,
                reminder=reminder,
                message=f"Reminder due: {reminder.title}",
            )
            created += 1
        maybe_send_reminder_email(reminder)

    return 200, {"notifications_created": created}


@router.put("/reminders/{reminder_id}", response={200: ReminderSchema, 404: ErrorSchema, 400: ErrorSchema})
def update_reminder(request, reminder_id: str, data: ReminderUpdateSchema):
    reminder = get_object_or_404(Reminder, id=reminder_id, user=request.auth)
    if data.title is not None:
        if not data.title.strip():
            return 400, {"detail": "Title is required"}
        reminder.title = data.title.strip()
    if data.description is not None:
        reminder.description = data.description.strip()
    if data.due_at is not None:
        reminder.due_at = data.due_at
    if data.is_done is not None:
        reminder.is_done = data.is_done
    if data.notify_email is not None:
        reminder.notify_email = data.notify_email
    reminder.save()
    if not reminder.is_done:
        maybe_send_reminder_email(reminder)
    return 200, reminder


@router.delete("/reminders/{reminder_id}", response={204: None, 404: ErrorSchema})
def delete_reminder(request, reminder_id: str):
    reminder = get_object_or_404(Reminder, id=reminder_id, user=request.auth)
    reminder.delete()
    return 204, None


@router.get("/notifications", response=List[ReminderNotificationSchema])
def list_notifications(request, unread_only: bool = False):
    notifications = ReminderNotification.objects.filter(user=request.auth)
    if unread_only:
        notifications = notifications.filter(is_read=False)
    return [
        {
            "id": item.id,
            "reminder_id": item.reminder_id,
            "message": item.message,
            "is_read": item.is_read,
            "created_at": item.created_at,
        }
        for item in notifications[:100]
    ]


@router.post("/notifications/{notification_id}/read", response={200: ReminderNotificationSchema, 404: ErrorSchema})
def mark_notification_read(request, notification_id: str):
    notification = get_object_or_404(ReminderNotification, id=notification_id, user=request.auth)
    notification.is_read = True
    notification.save(update_fields=["is_read"])
    return 200, {
        "id": notification.id,
        "reminder_id": notification.reminder_id,
        "message": notification.message,
        "is_read": notification.is_read,
        "created_at": notification.created_at,
    }


@router.post("/notes/{note_id}/check-password", response={200: NotePasswordResponse, 404: ErrorSchema, 401: ErrorSchema})
def check_note_password(request, note_id: str, data: NotePasswordCheckSchema):
    """
    POST /api/notes/notes/{id}/check-password
    Body: { "password": "my_password" }
    
    Перевірити пароль нотатки
    Повертає:
    - 200 OK: Пароль правильний + повні дані нотатки
    - 401: Пароль невірний
    - 404: Нотатка не знайдена
    """
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    
    # Якщо нотатка не захищена паролем
    if not note.is_password_protected:
        return 200, {
            "access_granted": True,
            "message": "Нотатка не захищена паролем"
        }
    
    # Перевірка паролю
    if note.check_password(data.password):
        return 200, {
            "access_granted": True,
            "message": "Пароль правильний"
        }
    else:
        return 401, {
            "detail": "Пароль невірний"
        }

@router.post("/notes/{note_id}/set-password", response={200: NotePasswordResponse, 404: ErrorSchema, 400: ErrorSchema})
def set_note_password(request, note_id: str, data: NotePasswordCheckSchema):
    """
    POST /api/notes/notes/{id}/set-password
    Body: { "password": "new_password" }
    
    Встановити пароль на нотатку
    """
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    
    if not data.password or len(data.password.strip()) < 4:
        return 400, {"detail": "Пароль повинен мати мінімум 4 символи"}
    
    note.set_password(data.password)
    note.save()
    
    return 200, {
        "access_granted": True,
        "message": "Пароль успішно встановлено"
    }

@router.post("/notes/{note_id}/remove-password", response={200: NotePasswordResponse, 404: ErrorSchema, 401: ErrorSchema})
def remove_note_password(request, note_id: str, data: NotePasswordCheckSchema):
    """
    POST /api/notes/notes/{id}/remove-password
    Body: { "password": "current_password" }
    
    Видалити пароль з нотатки (потрібна перевірка поточного паролю)
    """
    note = get_object_or_404(Note, id=note_id, user=request.auth)
    
    # Якщо нотатка не захищена паролем
    if not note.is_password_protected:
        return 400, {"detail": "Нотатка не захищена паролем"}
    
    # Перевірка паролю
    if not note.check_password(data.password):
        return 401, {"detail": "Пароль невірний"}
    
    note.clear_password()
    note.save()
    
    return 200, {
        "access_granted": True,
        "message": "Пароль успішно видалено"
    }
