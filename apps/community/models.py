from django.db import models
from django.conf import settings
from apps.notes.models import Note
import uuid

# ==================== КОМЕНТАР ====================
class Comment(models.Model):
    """Коментар до публічної нотатки"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    note = models.ForeignKey(
        Note, 
        on_delete=models.CASCADE, 
        related_name='comments'
    )  # До якої нотатки коментар
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments'
    )  # Хто написав коментар
    
    content = models.TextField(verbose_name="Вміст")  # Текст коментаря
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )  # Відповідь на інший коментар (для вкладених коментарів)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'comments'
        verbose_name = 'Коментар'
        verbose_name_plural = 'Коментарі'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username}: {self.content[:50]}"


# ==================== ЛАЙК ====================
class Like(models.Model):
    """Лайк на публічну нотатку"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        related_name='likes'
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='likes'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'likes'
        verbose_name = 'Лайк'
        verbose_name_plural = 'Лайки'
        unique_together = ['note', 'user']  # Один користувач - один лайк на нотатку
    
    def __str__(self):
        return f"{self.user.username} → {self.note.title}"


# ==================== ЛАНЦЮГ ІДЕЙ ====================
class IdeaChain(models.Model):
    """Ланцюг ідей - хто кого надихнув"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    original_note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        related_name='inspired_notes'
    )  # Оригінальна нотатка (джерело натхнення)
    
    inspired_note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        related_name='inspiration_source'
    )  # Нова нотатка (створена на основі оригінальної)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'idea_chains'
        verbose_name = 'Ланцюг ідей'
        verbose_name_plural = 'Ланцюги ідей'
    
    def __str__(self):
        return f"{self.original_note.title} → {self.inspired_note.title}"