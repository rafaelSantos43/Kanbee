---
date: 2026-03-17
status: active
tags: [progreso]
---

# Estado Actual del Proyecto

## Features implementadas

- [x] Autenticación (login, registro, logout, guardia de rutas)
- [x] Gestión de tableros (crear, listar, eliminar, buscar, favoritos)
- [x] Persistencia local con SQLite + Drizzle ORM
- [x] Latencia simulada en repositorios
- [x] Internacionalización (i18next configurado)
- [x] Componentes base (Screen, KText, KTextInput)
- [x] Roles de usuario (user, admin)

## Features pendientes

- [ ] Listas dentro de tableros (CRUD)
- [ ] Tarjetas dentro de listas (CRUD)
- [ ] Drag & Drop de tarjetas entre listas
- [ ] Cambio de estado de tarjetas
- [ ] Vista detalle de tablero (`[id].tsx`)
- [ ] Perfil de usuario
- [ ] Búsqueda global

## Tests

- Entidades: Board, Card, List (unitarios)
- Componentes: Screen, KText, KTextInput
- Repositorios: MockAuthRepository, MockBoardRepository
- Pendiente: tests de integración de flujos completos
