from django.db import models
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
import uuid

# ==================== КАТЕГОРІЯ ====================
class Category(models.Model):
    """Категорія для групування нотаток (Робота, Особисте, Навчання)"""
    
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )
    
    name = models.CharField(
        max_length=100, 
        verbose_name="Назва"
    )
    
    color = models.CharField(
        max_length=7, 
        default="#6366f1", 
        verbose_name="Колір"
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='categories'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name = 'Категорія'
        verbose_name_plural = 'Категорії'
        ordering = ['name']
        unique_together = ['user', 'name']
    
    def __str__(self):
        return self.name


# ==================== ТЕГ ====================
class Tag(models.Model):
    """Тег для маркування нотаток (#важливо, #терміново)"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, verbose_name="Назва")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tags')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'tags'
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'
        ordering = ['name']
        unique_together = ['user', 'name']
    
    def __str__(self):
        return self.name


# ==================== НОТАТКА ====================
class Note(models.Model):
    """Головна модель - нотатка з контентом"""
    
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )
    
    title = models.CharField(
        max_length=255, 
        verbose_name="Заголовок"
    )
    
    content = models.TextField(
        verbose_name="Вміст"
    )
    
    # ========== ЗВ'ЯЗКИ ==========
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='notes'
    )
    
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL,
        null=True, 
        blank=True, 
        related_name='notes'
    )
    
    tags = models.ManyToManyField(
        Tag, 
        blank=True, 
        related_name='notes'
    )
    
    # ========== СТАТУСИ ==========
    is_pinned = models.BooleanField(
        default=False, 
        verbose_name="Закріплена"
    )
    
    is_archived = models.BooleanField(
        default=False, 
        verbose_name="Архівована"
    )
    
    is_public = models.BooleanField(
        default=False, 
        verbose_name="Публічна"
    )
    
    # ========== НОВЫЕ ПОЛЯ ДЛЯ ПАРОЛЮ ==========
    is_password_protected = models.BooleanField(
        default=False,
        verbose_name="Захищена паролем"
    )
    
    password_hash = models.CharField(
        max_length=255,
        blank=True,
        default="",
        null=False,
        verbose_name="Хеш паролю"
    )
    
    # ========== ДАТИ ==========
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notes'
        verbose_name = 'Нотатка'
        verbose_name_plural = 'Нотатки'
        ordering = ['-is_pinned', '-updated_at']
        indexes = [
            models.Index(fields=['user', '-updated_at']),
            models.Index(fields=['is_password_protected']),
        ]
    
    def __str__(self):
        return self.title
    
    # ========== МЕТОДИ ДЛЯ РОБОТИ З ПАРОЛЕМ ==========
    
    def set_password(self, password: str) -> bool:
        """Встановити пароль для нотатки"""
        if not password or len(password) < 4:
            return False
        
        try:
            self.password_hash = make_password(password)
            self.is_password_protected = True
            return True
        except Exception as e:
            print(f"Помилка при встановленні паролю: {e}")
            return False
    
    def check_password(self, password: str) -> bool:
        """Перевірити чи правильний пароль"""
        if not self.is_password_protected:
            return True
        
        if not self.password_hash or self.password_hash == "":
            return False
        
        try:
            return check_password(password, self.password_hash)
        except Exception as e:
            print(f"Помилка при перевірці паролю: {e}")
            return False
    
    def remove_password(self) -> bool:
        """Видалити пароль з нотатки"""
        try:
            self.password_hash = ""
            self.is_password_protected = False
            return True
        except Exception as e:
            print(f"Помилка при видаленні паролю: {e}")
            return False
    
    def has_password(self) -> bool:
        """Перевірити чи нотатка захищена паролем"""
        return self.is_password_protected and bool(self.password_hash and self.password_hash != "")
    
    def get_display_title(self) -> str:
        """Отримати заголовок для відображення з іконками"""
        title = self.title
        
        if self.is_password_protected:
            title = f"🔒 {title}"
        elif self.is_public:
            title = f"🌐 {title}"
        
        return title
    
    def can_view(self, user=None, password: str = "") -> bool:
        """Перевірити чи користувач має доступ до нотатки"""
        # Власник завжди має доступ
        if user and self.user == user:
            return True
        
        # Приватна - тільки власник
        if not self.is_public:
            return False
        
        # Публічна без паролю
        if self.is_public and not self.is_password_protected:
            return True
        
        # Захищена паролем
        if self.is_password_protected:
            return bool(password) and self.check_password(password)
        
        return False