# Playbook: Refactorización de Features (KanBee)

Este playbook define el protocolo para limpiar y mejorar el código existente sin alterar su comportamiento funcional.

## Requisitos Previos
Antes de iniciar cualquier refactorización, la IA debe leer:
- `docs/architecture.md` (Para no romper las capas).
- `docs/IA_RULES.md` (Para respetar las reglas de oro).

---

## Paso 1: Análisis de la Feature
Identificar "olores de código" (code smells):
- Lógica de SQLite filtrada en componentes de UI.
- Componentes de React que superan las 150 líneas.
- Hooks con demasiadas responsabilidades.
- Tipos `any` o interfaces de TypeScript incompletas.

## Paso 2: Preservar el Comportamiento
**Regla de oro:** La refactorización mejora el "cómo", pero no cambia el "qué".
1. Ejecutar los tests existentes (`npm test`).
2. Si no hay tests, **crearlos primero** antes de mover una sola línea de código.
3. Asegurar que tras los cambios, todos los tests sigan en verde.

## Paso 3: Mejora Estructural (Clean Architecture)
Aplicar mejoras según la arquitectura de KanBee:
- **Desacoplamiento:** Mover lógica de persistencia de los componentes hacia el `infrastructure/repository`.
- **Modularidad:** Dividir componentes grandes en sub-componentes atómicos en `src/components/ui`.
- **Lógica:** Extraer lógica compleja de los componentes hacia Hooks especializados.

## Paso 4: Legibilidad y Claridad
Refactorizar buscando:
- Nombres de variables descriptivos (evitar `data`, `item`, `temp`).
- Funciones pequeñas que hagan una sola cosa (Single Responsibility Principle).
- **Claridad sobre astucia:** Preferir código que un junior entienda a uno "elegante" pero críptico.

## Paso 5: Respetar el Flujo de Dependencias
Verificar que se mantenga la jerarquía:
**UI → Hooks → Zustand Store → Repository Interface ← Repository Implementation**

- Los componentes de UI NO deben contener lógica de negocio ni SQL.

## Paso 6: Actualizar y Validar Tests
Si la estructura del código cambió:
- Actualizar los mocks en los tests si es necesario.
- Asegurar que los tests de integración sigan validando el flujo del usuario (ej: que la tarjeta se mueva correctamente en el Kanban).
- Nunca eliminar tests de comportamiento.

---

## Entregables Esperados
1. Código más limpio y tipado estrictamente.
2. Reducción de la deuda técnica.
3. Comportamiento del usuario idéntico al original.
4. Suite de pruebas actualizada y exitosa.