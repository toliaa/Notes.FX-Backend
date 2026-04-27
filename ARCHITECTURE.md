# Notes.FX Backend - Архітектура та Документація

## Загальний Огляд

Notes.FX Backend - це Django REST API для додатку керування нотатками з функціоналом спільноти, AI-асистентом та системою нагадувань.

---

## Архітектурна Діаграма Високого Рівня

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              NOTES.FX BACKEND                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           HTTP REQUEST                                   │    │
│  └───────────────────────────────┬─────────────────────────────────────────┘    │
│                                  │                                               │
│                                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         MIDDLEWARE LAYER                                 │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐   │    │
│  │  │ WhiteNoise   │  │ CORS Headers │  │ RateLimitMiddleware          │   │    │
│  │  │ (Static)     │  │              │  │ (IP-based rate limiting)     │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────────┘   │    │
│  └───────────────────────────────┬─────────────────────────────────────────┘    │
│                                  │                                               │
│                                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                          DJANGO NINJA API                                │    │
│  │                         /api/ (urls.py)                                  │    │
│  │  ┌────────────────────────────────────────────────────────────────────┐ │    │
│  │  │                        JWT Authentication                          │ │    │
│  │  │                    (apps/users/authentication.py)                  │ │    │
│  │  └────────────────────────────────────────────────────────────────────┘ │    │
│  └───────────────────────────────┬─────────────────────────────────────────┘    │
│                                  │                                               │
│        ┌─────────────────────────┼─────────────────────────┐                    │
│        │                         │                         │                    │
│        ▼                         ▼                         ▼                    │
│  ┌───────────────┐       ┌───────────────┐       ┌───────────────┐              │
│  │ /api/auth/*   │       │ /api/notes/*  │       │ /api/community│              │
│  │               │       │               │       │ /*            │              │
│  │ USERS MODULE  │       │ NOTES MODULE  │       │ COMMUNITY     │              │
│  │               │       │               │       │ MODULE        │              │
│  └───────┬───────┘       └───────┬───────┘       └───────┬───────┘              │
│          │                       │                       │                      │
│          ▼                       ▼                       ▼                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           DATABASE LAYER                                 │    │
│  │                    PostgreSQL / SQLite (dev)                            │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Структура Проекту

```
Notes.FX-Backend/
├── notesFx/                    # Головний Django проект
│   ├── settings.py             # Конфігурація проекту
│   ├── urls.py                 # Головні URL маршрути
│   ├── middleware.py           # Кастомний middleware (Rate Limiting)
│   ├── wsgi.py                 # WSGI entry point
│   └── asgi.py                 # ASGI entry point
│
├── apps/                       # Django додатки
│   ├── users/                  # Модуль користувачів
│   │   ├── models.py           # User модель
│   │   ├── api.py              # Auth endpoints
│   │   ├── schemas.py          # Pydantic schemas
│   │   └── authentication.py   # JWT Auth handler
│   │
│   ├── notes/                  # Модуль нотаток
│   │   ├── models.py           # Note, Category, Tag, Reminder...
│   │   ├── api.py              # Notes CRUD + AI endpoints
│   │   └── schemas.py          # Request/Response schemas
│   │
│   └── community/              # Модуль спільноти
│       ├── models.py           # Comment, Like, IdeaChain
│       ├── api.py              # Public feed, likes, comments
│       └── schemas.py          # Community schemas
│
├── requirements/               # Залежності
│   ├── base.txt
│   ├── railway.txt
│   └── render.txt
│
└── manage.py                   # Django CLI
```

---

## Модульна Архітектура

### Діаграма Взаємодії Модулів

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│                            MODULE DEPENDENCIES                                   │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐  │
│   │                                                                         │  │
│   │                          ┌──────────────────┐                           │  │
│   │                          │                  │                           │  │
│   │            ┌─────────────│   USERS MODULE   │─────────────┐             │  │
│   │            │             │                  │             │             │  │
│   │            │             │  - User Model    │             │             │  │
│   │            │             │  - JWT Auth      │             │             │  │
│   │            │             │  - Registration  │             │             │  │
│   │            │             │  - Login         │             │             │  │
│   │            │             └────────┬─────────┘             │             │  │
│   │            │                      │                       │             │  │
│   │            │     ForeignKey       │      ForeignKey       │             │  │
│   │            │     (user)           │      (user)           │             │  │
│   │            │                      │                       │             │  │
│   │            ▼                      ▼                       ▼             │  │
│   │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │  │
│   │  │                 │    │                 │    │                 │     │  │
│   │  │  NOTES MODULE   │◄───│  NOTES MODULE   │───►│ COMMUNITY MODULE│     │  │
│   │  │  (Categories)   │    │  (Notes)        │    │                 │     │  │
│   │  │                 │    │                 │    │  - Comments     │     │  │
│   │  │  - Category     │    │  - Note         │    │  - Likes        │     │  │
│   │  │  - Tag          │    │  - NoteRevision │    │  - IdeaChain    │     │  │
│   │  │                 │    │  - Reminder     │    │                 │     │  │
│   │  │                 │    │  - MoodEntry    │    │                 │     │  │
│   │  └─────────────────┘    └─────────────────┘    └─────────────────┘     │  │
│   │            │                      │                       │             │  │
│   │            │                      │                       │             │  │
│   │            └──────────────────────┼───────────────────────┘             │  │
│   │                                   │                                     │  │
│   │                                   ▼                                     │  │
│   │                    ┌──────────────────────────┐                         │  │
│   │                    │      AI PROVIDERS        │                         │  │
│   │                    │  - Gemini (default)      │                         │  │
│   │                    │  - OpenAI                │                         │  │
│   │                    │  - Ollama (local)        │                         │  │
│   │                    └──────────────────────────┘                         │  │
│   │                                                                         │  │
│   └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Users Module (apps/users)

### Призначення
Управління користувачами та автентифікація через JWT токени.

### Моделі

```
┌─────────────────────────────────────────┐
│               User                       │
├─────────────────────────────────────────┤
│ id: UUID (PK)                           │
│ username: CharField (unique)            │
│ email: EmailField (unique)              │
│ password: CharField (hashed)            │
│ avatar: ImageField (optional)           │
│ bio: TextField (optional)               │
│ is_verified: BooleanField               │
│ is_active: BooleanField                 │
│ created_at: DateTimeField               │
│ updated_at: DateTimeField               │
├─────────────────────────────────────────┤
│ Extends: AbstractUser                   │
│ USERNAME_FIELD: 'email'                 │
└─────────────────────────────────────────┘
```

### API Endpoints

| Method | Endpoint | Auth | Опис |
|--------|----------|------|------|
| POST | `/api/auth/register` | - | Реєстрація нового користувача |
| POST | `/api/auth/login` | - | Логін (повертає JWT tokens) |
| POST | `/api/auth/refresh` | - | Оновлення access token |
| GET | `/api/auth/me` | JWT | Отримання поточного користувача |

### Взаємодія з Іншими Модулями

```
Users Module
    │
    ├──► Notes Module
    │       └── User.notes (ForeignKey reverse)
    │       └── User.categories (ForeignKey reverse)
    │       └── User.tags (ForeignKey reverse)
    │       └── User.reminders (ForeignKey reverse)
    │       └── User.mood_entries (ForeignKey reverse)
    │
    └──► Community Module
            └── User.comments (ForeignKey reverse)
            └── User.likes (ForeignKey reverse)
```

---

## 2. Notes Module (apps/notes)

### Призначення
Основний функціонал додатку - управління нотатками, категоріями, тегами, нагадуваннями та AI-асистентом.

### Моделі та Зв'язки

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              NOTES MODULE MODELS                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌───────────────┐         ┌───────────────────────────────────────┐            │
│  │   Category    │         │                 Note                   │            │
│  ├───────────────┤         ├───────────────────────────────────────┤            │
│  │ id: UUID (PK) │◄────────│ category: FK (nullable, SET_NULL)     │            │
│  │ name: str     │         │ id: UUID (PK)                         │            │
│  │ color: str    │         │ title: str                            │            │
│  │ user: FK(User)│         │ content: TextField (HTML)             │            │
│  │ created_at    │         │ user: FK(User) CASCADE                │            │
│  └───────────────┘         │ is_pinned: bool                       │            │
│                            │ is_archived: bool                     │            │
│  ┌───────────────┐         │ is_public: bool                       │            │
│  │     Tag       │         │ is_password_protected: bool           │            │
│  ├───────────────┤         │ password: str (hashed)                │            │
│  │ id: UUID (PK) │◄───M2M──│ tags: M2M(Tag)                        │            │
│  │ name: str     │         │ created_at, updated_at                │            │
│  │ user: FK(User)│         └───────────────────┬───────────────────┘            │
│  │ created_at    │                             │                                │
│  └───────────────┘                             │ FK (note)                      │
│                                                │                                │
│                            ┌───────────────────▼───────────────────┐            │
│                            │            NoteRevision               │            │
│                            ├───────────────────────────────────────┤            │
│                            │ id: UUID (PK)                         │            │
│                            │ note: FK(Note) CASCADE                │            │
│                            │ user: FK(User) CASCADE                │            │
│                            │ snapshot: JSONField                   │            │
│                            │ created_at                            │            │
│                            └───────────────────────────────────────┘            │
│                                                                                  │
│  ┌───────────────────────────────────────┐  ┌───────────────────────────────┐   │
│  │              MoodEntry                │  │           Reminder            │   │
│  ├───────────────────────────────────────┤  ├───────────────────────────────┤   │
│  │ id: UUID (PK)                         │  │ id: UUID (PK)                 │   │
│  │ user: FK(User) CASCADE                │  │ user: FK(User) CASCADE        │   │
│  │ date: DateField                       │  │ title: str                    │   │
│  │ mood: int (1-5)                       │  │ description: TextField        │   │
│  │ note: TextField                       │  │ due_at: DateTimeField         │   │
│  │ created_at, updated_at                │  │ is_done: bool                 │   │
│  │ unique_together: (user, date)         │  │ notify_email: bool            │   │
│  └───────────────────────────────────────┘  │ email_sent_at: DateTime       │   │
│                                             │ created_at, updated_at        │   │
│                                             └───────────────┬───────────────┘   │
│                                                             │ FK (reminder)     │
│                                             ┌───────────────▼───────────────┐   │
│                                             │   ReminderNotification        │   │
│                                             ├───────────────────────────────┤   │
│                                             │ id: UUID (PK)                 │   │
│                                             │ user: FK(User) CASCADE        │   │
│                                             │ reminder: FK(Reminder)        │   │
│                                             │ message: str                  │   │
│                                             │ is_read: bool                 │   │
│                                             │ created_at                    │   │
│                                             └───────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### API Endpoints

| Method | Endpoint | Auth | Опис |
|--------|----------|------|------|
| **Categories** |
| GET | `/api/notes/categories` | JWT | Список категорій |
| POST | `/api/notes/categories` | JWT | Створити категорію |
| DELETE | `/api/notes/categories/{id}` | JWT | Видалити категорію |
| **Tags** |
| GET | `/api/notes/tags` | JWT | Список тегів |
| POST | `/api/notes/tags` | JWT | Створити тег |
| GET | `/api/notes/tags/{id}` | JWT | Отримати тег |
| PUT | `/api/notes/tags/{id}` | JWT | Оновити тег |
| DELETE | `/api/notes/tags/{id}` | JWT | Видалити тег |
| **Notes** |
| GET | `/api/notes/notes` | JWT | Список нотаток |
| POST | `/api/notes/notes` | JWT | Створити нотатку |
| GET | `/api/notes/notes/{id}` | JWT | Отримати нотатку |
| PUT | `/api/notes/notes/{id}` | JWT | Оновити нотатку |
| DELETE | `/api/notes/notes/{id}` | JWT | Видалити нотатку |
| POST | `/api/notes/notes/{id}/unlock` | JWT | Розблокувати паролем |
| GET | `/api/notes/notes/{id}/history` | JWT | Історія версій |
| POST | `/api/notes/notes/{id}/restore/{rev_id}` | JWT | Відновити версію |
| **File Uploads** |
| POST | `/api/notes/uploads` | JWT | Завантажити файли |
| **Mood Tracking** |
| GET | `/api/notes/mood` | JWT | Список записів настрою |
| POST | `/api/notes/mood` | JWT | Додати запис настрою |
| DELETE | `/api/notes/mood/{id}` | JWT | Видалити запис |
| **Reminders** |
| GET | `/api/notes/reminders` | JWT | Список нагадувань |
| POST | `/api/notes/reminders` | JWT | Створити нагадування |
| PUT | `/api/notes/reminders/{id}` | JWT | Оновити нагадування |
| DELETE | `/api/notes/reminders/{id}` | JWT | Видалити нагадування |
| GET | `/api/notes/notifications` | JWT | Список сповіщень |
| POST | `/api/notes/notifications/{id}/read` | JWT | Позначити прочитаним |
| **AI Features** |
| POST | `/api/notes/ai/assist` | JWT | AI допомога з текстом |
| POST | `/api/notes/ai/suggest-meta` | JWT | AI пропозиції тегів |

---

## 3. Community Module (apps/community)

### Призначення
Соціальні функції: публічна стрічка нотаток, лайки, коментарі та "ланцюги ідей" (inspiration chains).

### Моделі та Зв'язки

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            COMMUNITY MODULE MODELS                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                    ┌─────────────────────────────────┐                          │
│                    │        Note (is_public=True)    │                          │
│                    │        (from notes module)      │                          │
│                    └──────────┬───────┬──────────────┘                          │
│                               │       │                                          │
│              FK (note)        │       │       FK (note)                         │
│        ┌─────────────────────┘       └─────────────────────┐                   │
│        │                                                    │                   │
│        ▼                                                    ▼                   │
│  ┌─────────────────────────────┐          ┌─────────────────────────────┐      │
│  │          Comment            │          │            Like             │      │
│  ├─────────────────────────────┤          ├─────────────────────────────┤      │
│  │ id: UUID (PK)               │          │ id: UUID (PK)               │      │
│  │ note: FK(Note) CASCADE      │          │ note: FK(Note) CASCADE      │      │
│  │ user: FK(User) CASCADE      │          │ user: FK(User) CASCADE      │      │
│  │ content: TextField          │          │ created_at                  │      │
│  │ parent: FK(self, nullable)  │          │                             │      │
│  │ created_at, updated_at      │          │ unique_together:            │      │
│  │                             │          │   (note, user)              │      │
│  │ Related: replies (children) │          └─────────────────────────────┘      │
│  └─────────────────────────────┘                                                │
│                                                                                  │
│                    ┌─────────────────────────────────────────┐                  │
│                    │               IdeaChain                  │                  │
│                    ├─────────────────────────────────────────┤                  │
│                    │ id: UUID (PK)                           │                  │
│                    │ original_note: FK(Note) CASCADE         │◄── "Джерело"    │
│                    │ inspired_note: FK(Note) CASCADE         │◄── "Натхнення"  │
│                    │ created_at                              │                  │
│                    │                                         │                  │
│                    │ Зв'язок: "Нотатка A надихнула на B"     │                  │
│                    └─────────────────────────────────────────┘                  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### API Endpoints

| Method | Endpoint | Auth | Опис |
|--------|----------|------|------|
| **Public Feed** |
| GET | `/api/community/feed` | JWT | Публічна стрічка нотаток |
| GET | `/api/community/feed/{id}` | - | Публічна нотатка (деталі) |
| GET | `/api/community/notes/{id}` | - | Публічна нотатка (alias) |
| POST | `/api/community/notes/{id}/check-password` | - | Перевірка паролю |
| **Comments** |
| GET | `/api/community/notes/{id}/comments` | JWT | Коментарі до нотатки |
| POST | `/api/community/notes/{id}/comments` | JWT | Додати коментар |
| DELETE | `/api/community/comments/{id}` | JWT | Видалити коментар |
| **Likes** |
| POST | `/api/community/notes/{id}/like` | JWT | Toggle лайк |
| GET | `/api/community/notes/{id}/likes` | JWT | Список лайків |
| **Idea Chains** |
| POST | `/api/community/notes/{id}/inspire` | JWT | Скопіювати і натхнутися |
| POST | `/api/community/notes/{id}/copy` | JWT | Скопіювати нотатку |
| GET | `/api/community/notes/{id}/chain` | JWT | Ланцюг натхнень |

---

## Діаграма Потоку Даних (Data Flow)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW DIAGRAM                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│    ┌──────────────┐                                                             │
│    │   Frontend   │                                                             │
│    │  (Next.js)   │                                                             │
│    └──────┬───────┘                                                             │
│           │                                                                      │
│           │ HTTP Request + JWT Token                                            │
│           ▼                                                                      │
│    ┌──────────────────────────────────────────────────────────────────┐         │
│    │                        MIDDLEWARE CHAIN                          │         │
│    │                                                                  │         │
│    │  1. SecurityMiddleware (HTTPS, HSTS)                            │         │
│    │  2. WhiteNoiseMiddleware (Static files)                         │         │
│    │  3. CorsMiddleware (Cross-Origin)                               │         │
│    │  4. RateLimitMiddleware (DDoS protection) ◄── Cache (Redis)     │         │
│    │  5. SessionMiddleware                                           │         │
│    │  6. AuthenticationMiddleware                                    │         │
│    │                                                                  │         │
│    └───────────────────────────┬──────────────────────────────────────┘         │
│                                │                                                 │
│                                ▼                                                 │
│    ┌──────────────────────────────────────────────────────────────────┐         │
│    │                      DJANGO NINJA API                            │         │
│    │                                                                  │         │
│    │  ┌────────────────────────────────────────────────────────────┐ │         │
│    │  │                   JWT Authentication                        │ │         │
│    │  │           (apps/users/authentication.py)                   │ │         │
│    │  │                                                            │ │         │
│    │  │  Token ──► AccessToken() ──► user_id ──► User.get()       │ │         │
│    │  └────────────────────────────────────────────────────────────┘ │         │
│    │                                                                  │         │
│    │  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │         │
│    │  │ /api/auth/* │   │/api/notes/* │   │ /api/community/*    │   │         │
│    │  └──────┬──────┘   └──────┬──────┘   └──────────┬──────────┘   │         │
│    │         │                 │                     │               │         │
│    └─────────┼─────────────────┼─────────────────────┼───────────────┘         │
│              │                 │                     │                          │
│              ▼                 ▼                     ▼                          │
│    ┌─────────────────────────────────────────────────────────────────┐         │
│    │                      BUSINESS LOGIC                             │         │
│    │                                                                 │         │
│    │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │         │
│    │  │  User Service   │  │  Notes Service  │  │Community Service│ │         │
│    │  │                 │  │                 │  │                 │ │         │
│    │  │ - register()    │  │ - create_note() │  │ - get_feed()    │ │         │
│    │  │ - login()       │  │ - update_note() │  │ - toggle_like() │ │         │
│    │  │ - refresh()     │  │ - ai_assist()   │  │ - add_comment() │ │         │
│    │  │ - get_user()    │  │ - set_password()│  │ - copy_note()   │ │         │
│    │  └─────────────────┘  └────────┬────────┘  └─────────────────┘ │         │
│    │                                │                                │         │
│    │                                │ AI Requests                    │         │
│    │                                ▼                                │         │
│    │                     ┌─────────────────────┐                    │         │
│    │                     │   AI PROVIDERS      │                    │         │
│    │                     │ - Gemini (default)  │                    │         │
│    │                     │ - OpenAI            │                    │         │
│    │                     │ - Ollama (local)    │                    │         │
│    │                     └─────────────────────┘                    │         │
│    │                                                                 │         │
│    └─────────────────────────────────────────────────────────────────┘         │
│                                │                                                 │
│                                ▼                                                 │
│    ┌──────────────────────────────────────────────────────────────────┐         │
│    │                      DATABASE (PostgreSQL)                       │         │
│    │                                                                  │         │
│    │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │         │
│    │  │  users  │  │  notes  │  │  tags   │  │categories│            │         │
│    │  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │         │
│    │  ┌───────────────┐  ┌─────────┐  ┌─────────┐  ┌───────────────┐│         │
│    │  │note_revisions │  │ likes   │  │comments │  │ idea_chains   ││         │
│    │  └───────────────┘  └─────────┘  └─────────┘  └───────────────┘│         │
│    │  ┌───────────────┐  ┌─────────────────┐  ┌───────────────────┐ │         │
│    │  │ mood_entries  │  │   reminders     │  │reminder_notificat.│ │         │
│    │  └───────────────┘  └─────────────────┘  └───────────────────┘ │         │
│    │                                                                  │         │
│    └──────────────────────────────────────────────────────────────────┘         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Діаграма Бази Даних (ER Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            ENTITY RELATIONSHIP DIAGRAM                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌────────────────────┐                                                             │
│  │       users        │                                                             │
│  ├────────────────────┤                                                             │
│  │ id (PK) UUID       │                                                             │
│  │ username           │                                                             │
│  │ email (unique)     │                                                             │
│  │ password           │                                                             │
│  │ avatar             │                                                             │
│  │ bio                │                                                             │
│  │ is_verified        │                                                             │
│  │ created_at         │                                                             │
│  │ updated_at         │                                                             │
│  └─────────┬──────────┘                                                             │
│            │                                                                         │
│            │ 1                                                                       │
│            │                                                                         │
│            ├──────────────────┬──────────────────┬──────────────────┐               │
│            │                  │                  │                  │               │
│            │ *                │ *                │ *                │ *             │
│            ▼                  ▼                  ▼                  ▼               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │   categories    │ │      tags       │ │   mood_entries  │ │    reminders    │   │
│  ├─────────────────┤ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤   │
│  │ id (PK)         │ │ id (PK)         │ │ id (PK)         │ │ id (PK)         │   │
│  │ name            │ │ name            │ │ user_id (FK)    │ │ user_id (FK)    │   │
│  │ color           │ │ user_id (FK)    │ │ date            │ │ title           │   │
│  │ user_id (FK)    │ │ created_at      │ │ mood (1-5)      │ │ description     │   │
│  │ created_at      │ │                 │ │ note            │ │ due_at          │   │
│  │                 │ │ UK: user+name   │ │ created_at      │ │ is_done         │   │
│  │ UK: user+name   │ └────────┬────────┘ │ updated_at      │ │ notify_email    │   │
│  └────────┬────────┘          │          │                 │ │ email_sent_at   │   │
│           │                   │          │ UK: user+date   │ │ created_at      │   │
│           │                   │          └─────────────────┘ │ updated_at      │   │
│           │ 1                 │ *                            └────────┬────────┘   │
│           │                   │                                       │ 1          │
│           │                   │ M2M                                   │            │
│           │                   │                                       │ *          │
│           ▼                   ▼                                       ▼            │
│  ┌─────────────────────────────────────────────┐         ┌─────────────────────┐   │
│  │                    notes                    │         │reminder_notifications│   │
│  ├─────────────────────────────────────────────┤         ├─────────────────────┤   │
│  │ id (PK) UUID                                │         │ id (PK)             │   │
│  │ title                                       │         │ user_id (FK)        │   │
│  │ content (HTML)                              │         │ reminder_id (FK)    │   │
│  │ user_id (FK) ──────────────────────────────►│         │ message             │   │
│  │ category_id (FK, nullable) ◄────────────────│         │ is_read             │   │
│  │ is_pinned                                   │         │ created_at          │   │
│  │ is_archived                                 │         └─────────────────────┘   │
│  │ is_public                                   │                                    │
│  │ is_password_protected                       │                                    │
│  │ password (hashed)                           │                                    │
│  │ created_at                                  │                                    │
│  │ updated_at                                  │                                    │
│  │                                             │                                    │
│  │ M2M: tags ◄─────────────────────────────────│                                    │
│  └──────────────────┬──────────────────────────┘                                    │
│                     │                                                                │
│                     │ 1                                                              │
│                     │                                                                │
│      ┌──────────────┼──────────────┬──────────────────────┐                         │
│      │              │              │                      │                         │
│      │ *            │ *            │ *                    │ *                       │
│      ▼              ▼              ▼                      ▼                         │
│  ┌──────────┐ ┌──────────┐ ┌─────────────────┐ ┌────────────────────┐              │
│  │  likes   │ │ comments │ │ note_revisions  │ │    idea_chains     │              │
│  ├──────────┤ ├──────────┤ ├─────────────────┤ ├────────────────────┤              │
│  │ id (PK)  │ │ id (PK)  │ │ id (PK)         │ │ id (PK)            │              │
│  │ note_id  │ │ note_id  │ │ note_id (FK)    │ │ original_note (FK) │              │
│  │ user_id  │ │ user_id  │ │ user_id (FK)    │ │ inspired_note (FK) │              │
│  │ created  │ │ content  │ │ snapshot (JSON) │ │ created_at         │              │
│  │          │ │ parent_id│ │ created_at      │ │                    │              │
│  │ UK: note │ │ created  │ │                 │ │ "A inspired B"     │              │
│  │   +user  │ │ updated  │ └─────────────────┘ └────────────────────┘              │
│  └──────────┘ └──────────┘                                                          │
│               (self-ref)                                                            │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Система Аутентифікації

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          JWT AUTHENTICATION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            REGISTRATION                                     │ │
│  │                                                                            │ │
│  │  Client                      Server                          Database      │ │
│  │    │                           │                                │          │ │
│  │    │ POST /api/auth/register   │                                │          │ │
│  │    │ {username, email, pass}   │                                │          │ │
│  │    │ ─────────────────────────►│                                │          │ │
│  │    │                           │ Validate                       │          │ │
│  │    │                           │ Hash password                  │          │ │
│  │    │                           │ ──────────────────────────────►│          │ │
│  │    │                           │                  Create User   │          │ │
│  │    │                           │ ◄──────────────────────────────│          │ │
│  │    │                           │ Generate JWT tokens            │          │ │
│  │    │ ◄─────────────────────────│                                │          │ │
│  │    │ {access, refresh, user}   │                                │          │ │
│  │    │                           │                                │          │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                               LOGIN                                         │ │
│  │                                                                            │ │
│  │  Client                      Server                          Database      │ │
│  │    │                           │                                │          │ │
│  │    │ POST /api/auth/login      │                                │          │ │
│  │    │ {email, password}         │                                │          │ │
│  │    │ ─────────────────────────►│                                │          │ │
│  │    │                           │ Find user by email             │          │ │
│  │    │                           │ ──────────────────────────────►│          │ │
│  │    │                           │ ◄──────────────────────────────│          │ │
│  │    │                           │ Verify password hash           │          │ │
│  │    │                           │ Generate JWT tokens            │          │ │
│  │    │ ◄─────────────────────────│                                │          │ │
│  │    │ {access, refresh, user}   │                                │          │ │
│  │    │                           │                                │          │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                         PROTECTED REQUEST                                   │ │
│  │                                                                            │ │
│  │  Client                    JWTAuth                Server         Database  │ │
│  │    │                         │                      │               │      │ │
│  │    │ GET /api/notes/notes    │                      │               │      │ │
│  │    │ Authorization: Bearer X │                      │               │      │ │
│  │    │ ───────────────────────►│                      │               │      │ │
│  │    │                         │ Decode token         │               │      │ │
│  │    │                         │ Extract user_id      │               │      │ │
│  │    │                         │ ─────────────────────────────────►  │      │ │
│  │    │                         │                      │  Get User    │      │ │
│  │    │                         │ ◄─────────────────────────────────  │      │ │
│  │    │                         │ request.auth = user  │               │      │ │
│  │    │                         │ ─────────────────────►               │      │ │
│  │    │                         │                      │ Process       │      │ │
│  │    │ ◄───────────────────────────────────────────────               │      │ │
│  │    │ Response                │                      │               │      │ │
│  │    │                         │                      │               │      │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  JWT Token Structure:                                                           │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  Access Token (1 hour):                                                    │ │
│  │  {                                                                         │ │
│  │    "user_id": "uuid",                                                      │ │
│  │    "exp": timestamp,                                                       │ │
│  │    "iat": timestamp                                                        │ │
│  │  }                                                                         │ │
│  │                                                                            │ │
│  │  Refresh Token (7 days):                                                   │ │
│  │  {                                                                         │ │
│  │    "user_id": "uuid",                                                      │ │
│  │    "token_type": "refresh",                                                │ │
│  │    "exp": timestamp                                                        │ │
│  │  }                                                                         │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## AI Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            AI INTEGRATION ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                            │ │
│  │   Client                    Notes API                    AI Provider       │ │
│  │     │                          │                              │            │ │
│  │     │ POST /ai/assist          │                              │            │ │
│  │     │ {title, content,         │                              │            │ │
│  │     │  instruction}            │                              │            │ │
│  │     │ ─────────────────────────►                              │            │ │
│  │     │                          │                              │            │ │
│  │     │                          │ 1. enforce_ai_cooldown()     │            │ │
│  │     │                          │    (Rate limit check)        │            │ │
│  │     │                          │                              │            │ │
│  │     │                          │ 2. strip_html_for_ai()       │            │ │
│  │     │                          │    (Clean HTML tags)         │            │ │
│  │     │                          │                              │            │ │
│  │     │                          │ 3. call_ai_json()            │            │ │
│  │     │                          │ ────────────────────────────►│            │ │
│  │     │                          │                              │            │ │
│  │     │                          │         Based on AI_PROVIDER setting:     │ │
│  │     │                          │                              │            │ │
│  │     │                          │    ┌─────────────────────────┤            │ │
│  │     │                          │    │ if "gemini":            │            │ │
│  │     │                          │    │   call_gemini_json()    │            │ │
│  │     │                          │    │   ↳ generativelanguage  │            │ │
│  │     │                          │    │     .googleapis.com     │            │ │
│  │     │                          │    │                         │            │ │
│  │     │                          │    │ if "openai":            │            │ │
│  │     │                          │    │   call_openai_json()    │            │ │
│  │     │                          │    │   ↳ api.openai.com      │            │ │
│  │     │                          │    │                         │            │ │
│  │     │                          │    │ if "ollama":            │            │ │
│  │     │                          │    │   call_ollama_json()    │            │ │
│  │     │                          │    │   ↳ localhost:11434     │            │ │
│  │     │                          │    └─────────────────────────┤            │ │
│  │     │                          │                              │            │ │
│  │     │                          │ ◄────────────────────────────│            │ │
│  │     │                          │    JSON Response             │            │ │
│  │     │                          │                              │            │ │
│  │     │ ◄────────────────────────│                              │            │ │
│  │     │ {assistant_text: "..."}  │                              │            │ │
│  │     │                          │                              │            │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  AI Endpoints:                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                            │ │
│  │  POST /api/notes/ai/assist                                                 │ │
│  │  ├── Input: title, content, instruction                                    │ │
│  │  └── Output: assistant_text (AI-generated continuation)                    │ │
│  │                                                                            │ │
│  │  POST /api/notes/ai/suggest-meta                                           │ │
│  │  ├── Input: title, content                                                 │ │
│  │  └── Output: tags[], themes[] (AI-suggested metadata)                      │ │
│  │                                                                            │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  Configuration (settings.py):                                                   │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  AI_PROVIDER = "gemini" | "openai" | "ollama"                              │ │
│  │  AI_MIN_INTERVAL_SECONDS = 15  (cooldown between requests)                 │ │
│  │                                                                            │ │
│  │  # Gemini                                                                  │ │
│  │  GEMINI_API_KEY = "..."                                                    │ │
│  │  GEMINI_MODEL = "gemini-3-flash"                                           │ │
│  │                                                                            │ │
│  │  # OpenAI                                                                  │ │
│  │  OPENAI_API_KEY = "..."                                                    │ │
│  │  OPENAI_MODEL = "gpt-4.1-mini"                                             │ │
│  │                                                                            │ │
│  │  # Ollama (local)                                                          │ │
│  │  OLLAMA_BASE_URL = "http://localhost:11434"                                │ │
│  │  OLLAMA_MODEL = "qwen2.5:7b-instruct"                                      │ │
│  │                                                                            │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Технологічний Стек

| Компонент | Технологія | Версія |
|-----------|------------|--------|
| **Framework** | Django | 4.x |
| **API** | Django Ninja | latest |
| **Auth** | djangorestframework-simplejwt | latest |
| **Database** | PostgreSQL / SQLite | - |
| **Static Files** | WhiteNoise | latest |
| **CORS** | django-cors-headers | latest |
| **AI Providers** | Gemini, OpenAI, Ollama | - |
| **Email** | SendGrid SMTP | - |
| **Deployment** | Railway, Render | - |

---

## Конфігурація Середовища

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          ENVIRONMENT VARIABLES                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  # Core Settings                                                                │
│  SECRET_KEY=your-secret-key                                                     │
│  DEBUG=False                                                                    │
│  ALLOWED_HOSTS=example.com,www.example.com                                      │
│  CSRF_TRUSTED_ORIGINS=https://example.com                                       │
│                                                                                  │
│  # Database                                                                     │
│  USE_SQLITE=False                                                               │
│  DB_NAME=notesfx                                                                │
│  DB_USER=postgres                                                               │
│  DB_PASSWORD=password                                                           │
│  DB_HOST=localhost                                                              │
│  DB_PORT=5432                                                                   │
│                                                                                  │
│  # CORS (Frontend URL)                                                          │
│  CORS_ALLOWED_ORIGINS=https://notesfx.com                                       │
│                                                                                  │
│  # Rate Limiting                                                                │
│  RATE_LIMIT_REQUESTS=200                                                        │
│  RATE_LIMIT_WINDOW_SECONDS=60                                                   │
│                                                                                  │
│  # AI Configuration                                                             │
│  AI_PROVIDER=gemini                                                             │
│  AI_MIN_INTERVAL_SECONDS=15                                                     │
│  GEMINI_API_KEY=your-gemini-key                                                 │
│  GEMINI_MODEL=gemini-3-flash                                                    │
│                                                                                  │
│  # Email (SendGrid)                                                             │
│  EMAIL_HOST=smtp.sendgrid.net                                                   │
│  EMAIL_PORT=587                                                                 │
│  EMAIL_HOST_USER=apikey                                                         │
│  EMAIL_HOST_PASSWORD=your-sendgrid-key                                          │
│  DEFAULT_FROM_EMAIL=noreply@notesfx.com                                         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Висновок

Notes.FX Backend побудований за принципами модульної архітектури з чітким розподілом відповідальності:

1. **Users Module** - відповідає виключно за автентифікацію та управління користувачами
2. **Notes Module** - основний бізнес-логіка додатку з CRUD операціями, AI-інтеграцією та системою нагадувань
3. **Community Module** - соціальні функції, що розширюють базовий функціонал нотаток

Всі модулі взаємодіють через зовнішні ключі (ForeignKey) та M2M зв'язки, що забезпечує цілісність даних та легкість масштабування.
