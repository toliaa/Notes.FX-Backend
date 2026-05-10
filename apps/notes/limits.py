from django.conf import settings

from .models import Note


def get_note_count_limit_error(user) -> str | None:
    limit = int(getattr(settings, "MAX_NOTES_PER_USER", 5))
    if limit <= 0:
        return None
    if Note.objects.filter(user=user).count() >= limit:
        return f"Maximum {limit} notes per user"
    return None
