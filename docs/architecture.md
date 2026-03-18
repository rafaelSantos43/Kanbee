# Architecture Guide: KanBee Mobile

Este documento describe la arquitectura técnica de **KanBee**. El diseño se centra en la **Separación de Preocupaciones (SoC)** y el **Patrón Repositorio** para permitir que la aplicación funcione con SQLite localmente pero sea escalable a una API en el futuro.

## 1. Principios Arquitectónicos

- **Feature-Based Architecture:** La lógica se organiza por dominios de negocio (Auth, Boards, Lists, Cards).
- **Backend Agnostic:** La UI no sabe si los datos vienen de SQLite, una API REST o GraphQL.
- **Unidirectional Data Flow:** Los datos fluyen desde la infraestructura hacia la UI a través de contratos (Interfaces).
- **Testabilidad:** Cada capa se puede probar de forma aislada mediante Mocks.

---

## 2. Capas de la Aplicación

### A. Capa de Presentación (UI Layer)

- **Tecnología:** React Native + NativeWind.
- **Componentes:** Screens (en `src/app/`) y componentes de UI compartidos (`src/components/`).
- **Regla:** Prohibido realizar lógica de persistencia o cálculos complejos. Solo despachan acciones y muestran estado.

### B. Capa de Aplicación (State Layer)

- **Tecnología:** Zustand (con persist middleware + AsyncStorage para sesión).
- **Función:** Actúa como el orquestador. El Store de Zustand llama a los Repositorios y mantiene los datos en memoria para una respuesta instantánea de la UI.
- **Validación:** Zod + React Hook Form para validación de formularios.

### C. Capa de Dominio (Domain/Core Layer)

- **Interfaces:** Define los contratos (`IAuthRepository`, `IBoardRepository`).
- **Entities:** Modelos de datos puros y tipos de TypeScript (User, Board, List, Card, Session).
- **Utils:** Utilidades de negocio (hashPassword, date.helper).
- **Regla:** Es la capa más estable; no depende de ninguna librería externa de persistencia.

### D. Capa de Infraestructura (Data Layer)

- **Tecnología:** Drizzle ORM + `expo-sqlite`.
- **Función:** Implementación concreta de las interfaces. Contiene las queries y la lógica de base de datos.
- **Simulación:** Implementa latencia artificial (300-600ms) para validar la experiencia de usuario (UX).

---

## 3. Estructura de Carpetas

```text
src/
├── app/                    # Expo Router (Rutas y Screens)
│   ├── (auth)/             # Grupo de autenticación
│   └── (main)/             # Grupo principal (requiere auth)
│       └── (board)/        # Tableros
├── core/
│   ├── entities/           # Modelos de dominio (User, Board, List, Card)
│   ├── interfaces/         # Contratos de repositorios (IAuthRepository, IBoardRepository)
│   └── utils/              # Utilidades de negocio
├── infrastructure/
│   ├── database/           # Cliente Drizzle, schema y migraciones
│   └── repositories/       # Implementaciones SQL + mocks de testing
├── features/
│   ├── auth/               # Schemas Zod, hooks, componentes de auth
│   └── boards/             # Screens, componentes, hooks de tableros
├── store/                  # Zustand stores (useSessionStore, useBoardStore)
├── components/             # Componentes UI compartidos (Screen, KText, KTextInput)
├── hooks/                  # Hooks compartidos (useColorScheme, useThemeColor)
├── constants/              # Tema, roles de usuario
└── i18n/                   # Configuración i18next y archivos de localización
```

---

## 4. Flujo de Dependencias

Para mantener el desacoplamiento, las dependencias siempre deben fluir hacia adentro (hacia el Core):

```
UI → Hooks → Zustand Store → Repository Interface ← Repository Implementation (Drizzle/SQL)
```

**Regla:** La UI nunca depende directamente de la implementación de SQLite. Siempre depende de la Interface (Contrato).

---

## 5. Navegación (Expo Router)

La estructura de archivos define la navegación:

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

El root `_layout.tsx` evalúa `useSessionStore.authenticated` y los segmentos activos para redirigir entre `(auth)` y `(main)`.
