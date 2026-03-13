# Playbook: Crear Feature (KanBee)

Este playbook define el proceso estandarizado para implementar una nueva funcionalidad en el proyecto de principio a fin.

## Requisitos Previos
Antes de empezar, la IA debe leer:
- `docs/prd.md`
- `docs/architecture.md`
- `docs/IA_RULES.md`

---

## Paso 1: Entender y Planificar
Analizar los requerimientos e identificar:
- **Entidades:** ¿Necesitamos nuevos modelos de datos?
- **Interfaz:** ¿Qué métodos requiere el Repositorio?
- **UI:** ¿Qué componentes y pantallas de Expo Router se crearán?
- **Estado:** ¿Necesita un nuevo store de Zustand o extender uno existente?

Generar un **Plan de Implementación** antes de escribir código.

## Paso 2: Crear la Estructura de la Feature
Crear la carpeta en `src/features/[nombre-feature]`.
Estructura interna:
- `components/`: UI específica de la feature.
- `hooks/`: Lógica de conexión (Zustand/Repos).
- `__tests__/`: Pruebas unitarias e integración.

## Paso 3: Implementar Capa de Datos (Domain & Infra)
Siguiendo las reglas del Agente de Datos:
1. Crear/Actualizar **Entities** en `src/core/entities/`.
2. Definir la **Interface** en `src/core/interfaces/`.
3. Implementar el **Repository** en `src/infrastructure/repositories/` con SQLite.
4. **Importante:** Incluir la latencia simulada para pruebas de UX.

## Paso 4: Implementar Capa de Aplicación (Zustand)
1. Crear o extender el Store en `src/store/`.
2. El Store debe llamar a los métodos del Repositorio y manejar los estados de `error` e `isLoading`.

## Paso 5: Implementar Capa de UI
Siguiendo las reglas del Agente de UI:
1. Crear componentes atómicos con **NativeWind**.
2. Conectar los componentes a los Hooks/Stores.
3. Asegurar el manejo de: **Loading states, Error states y Empty states**.

## Paso 6: Integración con Navigation (Expo Router)
1. Crear las rutas necesarias en `src/app/`.
2. Las pantallas deben ser "limpias": solo orquestan componentes y hooks.



## Paso 7: Escribir Tests
Seguir el `playbook/add-tests.md`:
1. Tests unitarios del Repositorio y Store.
2. Tests de componentes con RNTL.
3. Tests de integración del flujo completo.

## Paso 8: Refactorización Final (GGA)
- Eliminar código duplicado.
- Verificar que no haya fugas de SQL en la capa de UI.
- Asegurar que el tipado de TypeScript sea estricto (no `any`).

---

## Entregables
Una funcionalidad completa que incluye:
- Interfaces y Entidades.
- Implementación de Repositorio SQLite.
- Store de Zustand.
- Componentes y Pantallas.
- Suite de pruebas completa.