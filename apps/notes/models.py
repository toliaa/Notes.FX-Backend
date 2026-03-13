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
    )  # Унікальний ID (не можна змінити)
    
    name = models.CharField(
        max_length=100, 
        verbose_name="Назва"
    )  # Назва категорії (max 100 символів)
    
    color = models.CharField(
        max_length=7, 
        default="#6366f1", 
        verbose_name="Колір"
    )  # Колір у форматі HEX (#ff0000)
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='categories'
    )  # Зв'язок з користувачем (якщо user видалений → категорія теж)
    
    created_at = models.DateTimeField(auto_now_add=True)  # Дата створення (автоматично)
    
    class Meta:
        db_table = 'categories'  # Назва таблиці в БД
        verbose_name = 'Категорія'
        verbose_name_plural = 'Категорії'
        ordering = ['name']  # Сортування за назвою
        unique_together = ['user', 'name']  # Унікальна комбінація (не може бути 2 "Робота" у одного user)
    
    def __str__(self):
        return self.name  # Відображення в Django Admin


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
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    title = models.CharField(
        max_length=255, 
        verbose_name="Заголовок"
    )  # Заголовок нотатки
    
    content = models.TextField(
        verbose_name="Вміст"
    )  # Вміст нотатки (HTML з редактора)
    
    # ========== ЗВ'ЯЗКИ ==========
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='notes'
    )  # Власник нотатки
    
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL,  # Якщо категорія видалена → category = NULL
        null=True, 
        blank=True, 
        related_name='notes'
    )  # Категорія (опційна)
    
    tags = models.ManyToManyField(
        Tag, 
        blank=True, 
        related_name='notes'
    )  # Багато тегів (ManyToMany)
    
    # ========== СТАТУСИ ==========
    is_pinned = models.BooleanField(
        default=False, 
        verbose_name="Закріплена"
    )  # Закріплена нотатка (показується зверху)
    
    is_archived = models.BooleanField(
        default=False, 
        verbose_name="Архівована"
    )  # В архіві (не показується в основному списку)
    
    is_public = models.BooleanField(
        default=False, 
        verbose_name="Публічна"
    )  # Публічна (може бачити будь-хто)
    
    # ========== ПАРОЛЮВАННЯ ==========
    is_password_protected = models.BooleanField(
        default=False,
        verbose_name="Захищена паролем"
    )  # Чи є пароль на нотатку
    
    password = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name="Гешований пароль"
    )  # Гешований пароль (не зберігаємо в чистому вигляді)
    
    # ========== ДАТИ ==========
    created_at = models.DateTimeField(auto_now_add=True)  # Дата створення
    updated_at = models.DateTimeField(auto_now=True)  # Дата останнього редагування
    
    class Meta:
        db_table = 'notes'
        verbose_name = 'Нотатка'
        verbose_name_plural = 'Нотатки'
        ordering = ['-is_pinned', '-updated_at']  # Сортування: спочатку pinned, потім по даті
    
    def __str__(self):
        return self.title
    
    # ========== МЕТОДИ ДЛЯ ПАРОЛЮ ==========
    
    def set_password(self, raw_password: str):
        """Встановити пароль (гешує його)"""
        if raw_password:
            self.password = make_password(raw_password)
            self.is_password_protected = True
        else:
            self.password = None
            self.is_password_protected = False
    
    def check_password(self, raw_password: str) -> bool:
        """Перевірити пароль"""
        if not self.password:
            return False
        return check_password(raw_password, self.password)
    
    def clear_password(self):
        """Видалити пароль"""
        self.password = None
        self.is_password_protected = False


class NoteRevision(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='revisions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='note_revisions')
    snapshot = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'note_revisions'
        ordering = ['-created_at']

    def __str__(self):
        return f"Revision of {self.note_id} at {self.created_at.isoformat()}"


class MoodEntry(models.Model):
    MOOD_CHOICES = (
        (1, "Very bad"),
        (2, "Bad"),
        (3, "Neutral"),
        (4, "Good"),
        (5, "Great"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mood_entries")
    date = models.DateField()
    mood = models.PositiveSmallIntegerField(choices=MOOD_CHOICES)
    note = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "mood_entries"
        ordering = ["-date", "-updated_at"]
        unique_together = ("user", "date")

    def __str__(self):
        return f"{self.user_id} mood {self.mood} on {self.date.isoformat()}"


class Reminder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reminders")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    due_at = models.DateTimeField()
    is_done = models.BooleanField(default=False)
    notify_email = models.BooleanField(default=True)
    email_sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reminders"
        ordering = ["is_done", "due_at"]

    def __str__(self):
        return f"Reminder {self.title} for {self.user_id} at {self.due_at.isoformat()}"


class ReminderNotification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reminder_notifications")
    reminder = models.ForeignKey(Reminder, on_delete=models.CASCADE, related_name="notifications")
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "reminder_notifications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Notification for {self.user_id}: {self.message}"
