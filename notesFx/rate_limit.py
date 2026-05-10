import hashlib
from typing import Optional

from django.core.cache import cache


def enforce_rate_limit(key: str, limit: int, window_seconds: int) -> Optional[str]:
    if limit <= 0 or window_seconds <= 0:
        return None

    try:
        added = cache.add(key, 1, timeout=window_seconds)
        if added:
            return None
        count = cache.incr(key, 1)
    except Exception:
        return None

    if count > limit:
        return "Too many requests. Please wait and try again."
    return None


def get_rate_limit_error(key: str, limit: int) -> Optional[str]:
    if limit <= 0:
        return None

    try:
        count = cache.get(key, 0) or 0
    except Exception:
        return None

    if count >= limit:
        return "Too many requests. Please wait and try again."
    return None


def clear_rate_limit(key: str) -> None:
    try:
        cache.delete(key)
    except Exception:
        pass


def get_client_ip(request) -> str:
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR") or "unknown"


def stable_hash(*parts) -> str:
    normalized = ":".join("" if part is None else str(part).strip().lower() for part in parts)
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()
