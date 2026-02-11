from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from ninja import NinjaAPI
from apps.community.api import router as community_router
from apps.users.api import router as users_router
from apps.notes.api import router as notes_router
from apps.users.authentication import JWTAuth

api = NinjaAPI(
    title="Notes.FX API",
    version="1.0.0",
    description="REST API для Notes.FX - додаток для створення та керування нотатками.",
    docs_url="/docs",
)

api.add_router("/auth", users_router)
api.add_router("/notes", notes_router, auth=JWTAuth())
api.add_router("/community", community_router) 


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)