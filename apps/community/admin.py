from django.contrib import admin
from .models import Comment, Like, IdeaChain

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'note', 'content_preview', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'user__username']
    
    def content_preview(self, obj):
        return obj.content[:50]
    content_preview.short_description = 'Вміст'  # type: ignore

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'note', 'created_at']
    list_filter = ['created_at']

@admin.register(IdeaChain)
class IdeaChainAdmin(admin.ModelAdmin):
    list_display = ['original_note', 'inspired_note', 'created_at']
    list_filter = ['created_at']