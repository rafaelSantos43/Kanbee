# Architecture Guide: KanBee Mobile

Este documento describe la arquitectura técnica de **KanBee**. El diseño se centra en la **Separación de Preocupaciones (SoC)** y el **Patrón Repositorio** para permitir que la aplicación funcione con SQLite localmente pero sea escalable a una API en el futuro.

## 1. Principios Arquitectónicos

- **Feature-Based Architecture:** La lógica se organiza por dominios de negocio (Boards, Cards, Lists).
- **Backend Agnostic:** La UI no sabe si los datos vienen de SQLite, una API REST o GraphQL.
- **Unidirectional Data Flow:** Los datos fluyen desde la infraestructura hacia la UI a través de contratos (Interfaces).
- **Testabilidad:** Cada capa se puede probar de forma aislada mediante Mocks.

---

## 2. Capas de la Aplicación



### A. Capa de Presentación (UI Layer)
- **Tecnología:** React Native + NativeWind.
- **Componentes:** Screens (en `src/app`) y componentes de UI atómicos.
- **Regla:** Prohibido realizar lógica de persistencia o cálculos complejos. Solo despachan acciones y muestran estado.

### B. Capa de Aplicación (State Layer)
- **Tecnología:** Zustand.
- **Función:** Actúa como el orquestador. El Store de Zustand llama a los Repositorios y mantiene los datos en memoria para una respuesta instantánea de la UI.

### C. Capa de Dominio (Domain/Core Layer)
- **Interfaces:** Define los contratos (ej: `ICardRepository`).
- **Entities:** Modelos de datos puros y tipos de TypeScript.
- **Regla:** Es la capa más estable; no depende de ninguna librería externa de persistencia.

### D. Capa de Infraestructura (Data Layer)
- **Tecnología:** `expo-sqlite`.
- **Función:** Implementación concreta de las interfaces. Contiene las queries SQL y la lógica de base de datos.
- **Simulación:** Implementa latencia artificial para validar la experiencia de usuario (UX).

---

## 3. Estructura de Carpetas

```text
src/
 ├── app/                 # Expo Router (Rutas y Screens)
 ├── core/                # El "Corazón" de la app
 │    ├── interfaces/     # Contratos de Repositorios (ICardRepository.ts)
 │    └── entities/       # Modelos de datos (Board.ts, Card.ts)
 ├── infrastructure/      # Implementaciones técnicas
 │    ├── database/       # Configuración de SQLite y Migraciones
 │    └── repositories/   # Implementaciones SQL de las interfaces
 ├── features/            # Módulos de negocio (Boards, Kanban, Auth)
 │    ├── components/     # Componentes específicos de la feature
 │    ├── hooks/          # Hooks que conectan UI con Zustand/Repos
 │    └── __tests__/      # Tests de integración de la feature
 ├── components/          # Componentes UI globales (shared)
 └── store/               # Estados globales de Zustand


4. Flujo de Dependencias
Para mantener el desacoplamiento, las dependencias siempre deben fluir hacia adentro (hacia el Core):

UI → Hooks → Zustand Store → Repository Interface ← Repository Implementation (SQL)

Nota: La UI nunca depende directamente de la implementación de SQLite. Siempre depende de la Interface (Contrato).

5. Estrategia de Rendimiento
Listas Pesadas: Uso obligatorio de FlashList (Shopify) para el tablero Kanban y listas de tarjetas.

Memoización: Uso estratégico de useMemo y useCallback en las funciones de Drag & Drop para evitar re-renders innecesarios.

Optimistic Updates: Zustand actualizará la UI inmediatamente mientras el Repositorio confirma la operación en SQLite de fondo.

6. Navegación (Expo Router)
La estructura de archivos define la navegación:

src/app/(auth)/: Flujo de autenticación.

src/app/(tabs)/: Navegación principal (Boards, Search, Profile).

src/app/board/[id].tsx: Vista detallada del tablero Kanban.