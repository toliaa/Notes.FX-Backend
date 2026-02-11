# Notes.FX-Backend

A Django REST API backend for Notes.FX - a note-taking application with user management, notes, and community features.

### Key Features
- 👤 User authentication and management
- 📝 Note creation, editing, and organization with categories and tags
- 🌐 Community features: comments, likes, idea chains
- 🔐 JWT-based authentication
- 📊 Django admin interface for management

### API Endpoints

#### Authentication
```
POST   /api/auth/login              # User login
POST   /api/auth/register           # User registration
POST   /api/auth/refresh            # Refresh JWT token
```

#### Notes
```
GET    /api/notes                   # List user notes
POST   /api/notes                   # Create note
GET    /api/notes/{id}              # Get note details
PUT    /api/notes/{id}              # Update note
DELETE /api/notes/{id}              # Delete note
GET    /api/notes/{id}/comments     # Get note comments
POST   /api/notes/{id}/comments     # Add comment
```

#### Community
```
GET    /api/community/notes/{id}/chain  # Get idea chain
POST   /api/community/notes/{id}/copy   # Copy note to inspire
```

All endpoints require JWT authentication.

---

## Main Documentation