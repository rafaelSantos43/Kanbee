# Spec: Gestión de Tableros (Boards)

## Descripción
El usuario debe poder organizar sus flujos de trabajo en diferentes tableros visuales.

## Requerimientos Funcionales
- **CRUD Completo:** Crear, Leer, Actualizar y Eliminar tableros.
- **Personalización:** Cada tablero puede tener un color de fondo o tema definido.
- **Favoritos:** Opción para marcar tableros como importantes y anclarlos arriba.
- **Contador:** Mostrar cuántas listas y tareas tiene cada tablero en la vista principal.

## Interacciones UI
- Lista de tableros en formato Grid.
- Feedback visual al eliminar (Confirmación).
- Latencia simulada de 400ms en la carga para mostrar Shimmer Effects.

## Capas involucradas
- **Infra:** `BoardRepository` (Consultas SQL para la tabla `boards`).
- **Store:** `useBoardStore`.
- **UI:** Pantalla principal `(tabs)/index.tsx`.