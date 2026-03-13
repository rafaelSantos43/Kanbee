# Spec: Flujo Kanban (Lists & Cards)

## Descripción
Implementación del tablero dinámico donde las tarjetas se mueven entre columnas.

## Requerimientos Funcionales
- **Estructura:** Un Tablero contiene N Listas. Una Lista contiene N Tarjetas.
- **Ordenamiento:** Tanto las Listas como las Tarjetas deben tener un `order_index` para persistir su posición.
- **Movimiento:** - Mover tarjeta dentro de la misma lista (reordenar).
    - Mover tarjeta a una lista diferente (cambiar de estado).
- **Detalle de Tarjeta:** Al presionar una tarjeta, se abre un modal con descripción y checklist.

## Reglas de Datos (SQLite)
- Al mover una tarjeta, se debe disparar una transacción SQL que actualice los `order_index` de los elementos afectados.
- Integridad referencial: Si se borra una Lista, se deben borrar sus Tarjetas (Cascade Delete).

## UI/UX
- Uso de `FlashList` para el scroll vertical de tarjetas.
- Animaciones suaves al mover elementos usando `Reanimated`.