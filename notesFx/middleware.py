import time
from typing import Optional

from django.core.cache import cache
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin


class RateLimitMiddleware(MiddlewareMixin):
    """
    Simple IP-based rate limiting to mitigate basic DDoS/burst traffic.
    Uses Django cache backend (configure Redis in production).
    """

    def _get_client_ip(self, request) -> str:
        # Honor X-Forwarded-For if present (behind proxy).
        forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR") or "unknown"

    def _is_exempt_path(self, path: str) -> bool:
        return (
            path.startswith("/admin/")
            or path.startswith("/static/")
            or path.startswith("/media/")
        )

    def process_request(self, request):
        path = request.path or "/"
        if self._is_exempt_path(path):
            return None

        limit = getattr(request, "rate_limit_requests", None)
        window = getattr(request, "rate_limit_window", None)
        # Use settings defaults via request object fallback.
        if limit is None:
            limit = getattr(request, "_rate_limit_requests", None)
        if window is None:
            window = getattr(request, "_rate_limit_window", None)

        # Pull from settings if not set on request.
        from django.conf import settings

        limit = limit or getattr(settings, "RATE_LIMIT_REQUESTS", 200)
        window = window or getattr(settings, "RATE_LIMIT_WINDOW_SECONDS", 60)

        client_ip = self._get_client_ip(request)
        bucket = int(time.time() // window)
        cache_key = f"rl:{client_ip}:{bucket}"

        try:
            added = cache.add(cache_key, 1, timeout=window + 5)
            if not added:
                try:
                    count = cache.incr(cache_key, 1)
                except ValueError:
                    cache.set(cache_key, 1, timeout=window + 5)
                    count = 1
            else:
                count = 1
        except Exception:
            # Fail open if cache backend is unavailable.
            return None

        if count > limit:
            return JsonResponse(
                {"detail": "Rate limit exceeded. Please slow down."},
                status=429,
            )
        return None
