# Playbook: Agregar Tests (KanBee)

Este playbook define el estándar para añadir pruebas a funcionalidades existentes o nuevas, asegurando la estabilidad de la arquitectura desacoplada.

## Requisitos Previos
Antes de escribir cualquier test, la IA debe leer:
- `docs/testing-strategy.md` (Para conocer los niveles de prueba).
- `docs/architecture.md` (Para entender las capas y qué mockear).

---

## Paso 1: Identificar Objetivos de Prueba
Analizar la feature y priorizar:
- **Lógica de Datos:** Métodos del repositorio (SQLite).
- **Lógica de Estado:** Acciones de Zustand.
- **Flujos Críticos:** Drag & Drop de tarjetas y creación de tableros.

## Paso 2: Agregar Pruebas Unitarias (Lógica)
Crear tests para piezas aisladas en `__tests__`:
- **Hooks:** Validar que `useKanban` retorne el estado correcto.
- **Stores:** Verificar que el `boardStore` actualice la UI tras una mutación.
- **Utilidades:** Probar funciones de ordenamiento y filtrado.

**Enfoque:** Entradas/Salidas, manejo de errores y casos de borde (edge cases).

## Paso 3: Agregar Pruebas de Componentes (UI)
Usar **React Native Testing Library** para validar lo que el usuario ve:
- **Renderizado:** ¿Se muestran correctamente los nombres de las tarjetas?
- **Interacción:** ¿Se dispara el evento correcto al presionar "Crear Lista"?
- **Accesibilidad:** Verificar que los elementos tengan roles y etiquetas correctas.

## Paso 4: Agregar Pruebas de Integración (Flujos Reales)
Simular interacciones completas del usuario sin depender del backend real:
- **Flujo:** "Login -> Ver Tableros -> Seleccionar uno -> Mover Tarjeta".
- Usar el **MockRepository** para interceptar las llamadas a SQLite y devolver datos controlados.

## Paso 5: Validar Cobertura (Coverage)
Asegurar que se cumplen los umbrales definidos en la estrategia:
- **Hooks & Logic:** 90%
- **Zustand Stores:** 90%
- **Repositories:** 85%
- **UI Components:** 70–80%

## Paso 6: Refactorizar y Limpiar Tests
- Eliminar código duplicado en los setups de los tests.
- Asegurar que los mensajes de error sean claros (descripciones de `it` o `test`).
- **Claridad:** Un test debe servir como documentación de cómo funciona la feature.

---

## Entregables
1. Pruebas unitarias, de componente e integración.
2. Mocks configurados correctamente.
3. Reporte de cobertura que cumpla con los objetivos.