# PRD: KanBee Mobile

## 1. Resumen

**KanBee** es una aplicación móvil de gestión de proyectos estilo Kanban, desarrollada con React Native y Expo. El proyecto tiene un doble propósito: construir un producto funcional y validar un flujo de desarrollo asistido por IA.

### Objetivos

- **Desarrollo asistido por IA:** Validar el flujo Spec-Driven Design (SDD) con herramientas como Cursor y Engram.
- **Arquitectura desacoplada:** Implementar persistencia local (SQLite) intercambiable por una API remota sin modificar la capa de presentación.
- **Calidad desde el inicio:** Integrar pruebas unitarias y de integración en cada funcionalidad.
- **Medición de productividad:** Evaluar el impacto de herramientas IA en el ciclo de vida del software.

---

## 2. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework móvil | React Native 0.81 + Expo SDK 54 |
| Navegación | Expo Router 6 (file-based) |
| Estado global | Zustand 5 (con persist middleware + AsyncStorage) |
| Base de datos | SQLite (expo-sqlite) + Drizzle ORM |
| Validación | Zod + React Hook Form |
| Estilos | NativeWind (Tailwind CSS para React Native) |
| Internacionalización | i18next + react-i18next |
| Autenticación | CryptoJS (SHA256) para hash de contraseñas |
| Testing | Jest + React Native Testing Library |
| Herramientas IA | Cursor (IDE), Claude Code, Engram (Context Memory) |

---

## 3. Arquitectura

El proyecto sigue **Clean Architecture** combinada con una organización **basada en funcionalidades (features)**.

### 3.1 Capas

- **Core** (`src/core/`): Entidades de dominio, interfaces de repositorio y utilidades de negocio. Sin dependencias de framework.
- **Infrastructure** (`src/infrastructure/`): Implementaciones concretas de los repositorios usando Drizzle ORM + SQLite. Incluye schema, cliente de base de datos y migraciones.
- **Features** (`src/features/`): Módulos independientes (auth, boards) que agrupan componentes, hooks, pantallas y schemas de validación.
- **Store** (`src/store/`): Stores de Zustand para estado global (sesión y tableros).
- **Components** (`src/components/`): Componentes de UI compartidos y reutilizables.

### 3.2 Estructura del Proyecto

```text
src/
├── app/                    # Rutas de Expo Router
│   ├── (auth)/             # Grupo de autenticación
│   │   ├── index.tsx       # Pantalla de login
│   │   └── register.tsx    # Pantalla de registro
│   └── (main)/             # Grupo principal (requiere autenticación)
│       └── (board)/        # Grupo de tableros
│           ├── index.tsx   # Lista de tableros
│           └── [id].tsx    # Detalle de tablero
├── core/
│   ├── entities/           # Modelos de dominio (User, Board, List, Card, Session)
│   ├── interfaces/         # Contratos de repositorios (IAuthRepository, IBoardRepository)
│   └── utils/              # Utilidades de negocio (hashPassword, date.helper)
├── infrastructure/
│   ├── database/           # Cliente Drizzle, schema y migraciones
│   └── repositories/       # Implementaciones SQL y mocks de testing
├── features/
│   ├── auth/               # Schemas Zod, hooks (useLogin, useRegister), componentes
│   └── boards/             # Pantallas, componentes, hooks del módulo de tableros
├── store/                  # useSessionStore, useBoardStore
├── components/             # Screen, KText, KTextInput
├── hooks/                  # Hooks compartidos (useColorScheme, useThemeColor)
├── constants/              # Tema, roles de usuario
└── i18n/                   # Configuración y archivos de localización
```

### 3.3 Patrón Repositorio

Los contratos se definen en `src/core/interfaces/` y las implementaciones en `src/infrastructure/repositories/`:

| Interfaz | Implementación | Mock (testing) |
|---|---|---|
| `IAuthRepository` | `DrizzleAuthRepository` | `MockAuthRepository` |
| `IBoardRepository` | `SQLiteBoardRepository` | `MockBoardRepository` |

La selección del repositorio se hace por inyección de dependencias en los stores, usando `NODE_ENV` para alternar entre implementación real y mock.

---

## 4. Modelo de Datos

Base de datos SQLite con Drizzle ORM. Schema en `src/infrastructure/database/schema.ts`.

### Tablas y relaciones

```
users (1) ──→ (N) boards (1) ──→ (N) lists (1) ──→ (N) cards
```

- **users**: id, username, email, password, avatar, role (`user` | `admin`), createdAt.
- **boards**: id, userId (FK), title, color, isFavorite, createdAt, updatedAt.
- **lists**: id, boardId (FK), title, orderIndex, createdAt, updatedAt.
- **cards**: id, listId (FK), title, description, status, orderIndex, createdAt, updatedAt.

Todas las foreign keys tienen `ON DELETE CASCADE`. Se habilita `PRAGMA foreign_keys = ON`.

### Estados de tarjeta

`todo` | `in-progress` | `done` | `blocked`

---

## 5. Funcionalidades

### 5.1 Autenticación

Gestión de sesión local con persistencia en AsyncStorage (vía Zustand persist middleware).

- **Login**: Validación con Zod, hash de contraseña con SHA256, consulta a `DrizzleAuthRepository`.
- **Registro**: Formulario con username, email, password, rol y avatar. Validación con Zod.
- **Logout**: Limpia el store de sesión y redirige al grupo `(auth)`.
- **Guardia de rutas**: El root `_layout.tsx` protege las rutas `(main)` verificando el estado de autenticación.

### 5.2 Tableros (Boards)

Gestión de tableros Kanban del usuario autenticado.

- **Funciones**: Crear, listar, eliminar y buscar tableros.
- **Favoritos**: Marcar tableros como favoritos.
- **Estado**: Gestionado por `useBoardStore` con soporte de loading y errores.

### 5.3 Listas y Tarjetas (Kanban Logic)

La lógica central del flujo Kanban.

- **Listas**: Crear listas dentro de tableros con orden configurable.
- **Tarjetas**: Crear tarjetas con título, descripción, estado y orden.
- **Drag & Drop**: Mover tarjetas entre listas (planificado).
- **Cambio de estado**: Transiciones entre `todo`, `in-progress`, `done` y `blocked`.

### 5.4 Latencia Simulada

El repositorio local simula un retraso de red (300-600ms) para validar estados de carga y efectos de shimmer/loading.

---

## 6. Navegación

Expo Router con file-based routing y route groups para separar autenticación de contenido principal.

```text
app/
├── _layout.tsx              # Root layout + guardia de autenticación
├── index.tsx                # Redirección según estado de sesión
├── (auth)/
│   ├── _layout.tsx
│   ├── index.tsx            # Login
│   └── register.tsx         # Registro
└── (main)/
    ├── _layout.tsx          # Drawer navigation (lateral derecho)
    └── (board)/
        ├── _layout.tsx
        ├── index.tsx        # Lista de tableros
        └── [id].tsx         # Detalle de tablero
```

**Flujo**: El root layout evalúa `useSessionStore.authenticated` y los segmentos activos para redirigir entre `(auth)` y `(main)`.

---

## 7. Estrategia de Testing

Testing integrado desde el inicio del desarrollo (TDD asistido).

| Tipo | Alcance | Ubicación |
|---|---|---|
| Unit Tests | Entidades, utilidades, hooks | `src/core/entities/__tests__/` |
| Repository Tests | Validación de contratos con mocks | `src/infrastructure/repositories/__tests__/` |
| Component Tests | Renderizado y lógica de UI | `src/components/__tests__/` |
| Screen Tests | Flujos de pantalla | `src/features/*/screens/__tests__/` |

- **Framework**: Jest con preset `jest-expo`.
- **Mocks**: Configurados en `jest.setup.js` para expo-router, expo-sqlite, AsyncStorage y otros módulos nativos.
- **Cobertura**: Se recolecta de `src/` excluyendo rutas de `src/app/`.

---

## 8. Workflow de Desarrollo con IA

El desarrollo sigue el ciclo:

**Especificación (PRD)** → **Contrato (Interface)** → **Implementación (Repo/UI)** → **Tests** → **Refactorización**

Se utiliza Engram para guardar decisiones técnicas y mantener contexto entre sesiones de desarrollo con IA.

---

## 9. Métricas del Experimento

| KPI | Descripción |
|---|---|
| Productividad | Tiempo de entrega de features con vs. sin IA |
| Mantenibilidad | Facilidad de reemplazar la capa de infrastructure (SQLite → API) |
| Calidad | Cobertura de código y ausencia de bugs críticos en el flujo Kanban |
