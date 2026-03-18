---
date: 2026-03-17
status: active
tags: [datos, schema]
---

# Modelo de Datos

SQLite con Drizzle ORM. Schema en `src/infrastructure/database/schema.ts`.

## Tablas

```
users (1) → (N) boards (1) → (N) lists (1) → (N) cards
```

- **users:** id, username, email, password, avatar, role (user|admin), createdAt
- **boards:** id, userId (FK), title, color, isFavorite, createdAt, updatedAt
- **lists:** id, boardId (FK), title, orderIndex, createdAt, updatedAt
- **cards:** id, listId (FK), title, description, status (todo|in-progress|done|blocked), orderIndex, createdAt, updatedAt

Todas las FK usan `ON DELETE CASCADE`. Se habilita `PRAGMA foreign_keys = ON`.
