from django.contrib import admin
from .models import Note, Category, Tag

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'user', 'created_at']
    list_filter = ['user']
    search_fields = ['name']

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'created_at']
    list_filter = ['user']
    search_fields = ['name']

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'is_pinned', 'is_archived', 'is_public', 'created_at']
    list_filter = ['is_pinned', 'is_archived', 'is_public', 'category', 'created_at']
    search_fields = ['title', 'content']
    filter_horizontal = ['tags']