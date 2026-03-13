# Testing Strategy: KanBee Mobile

Este documento define la estrategia de pruebas para el proyecto **KanBee**. El enfoque principal es asegurar que la lógica de negocio y la persistencia (SQLite) funcionen correctamente bajo una arquitectura desacoplada.

## 1. Filosofía de Testing

En KanBee, probamos **comportamientos, no implementaciones**. Dado que usamos el Patrón Repositorio, nuestras pruebas deben garantizar que la UI reaccione correctamente sin importar si los datos vienen de SQLite o de una memoria volátil.

---

## 2. Herramientas de Testing

- **Jest:** Framework principal de ejecución de pruebas.
- **React Native Testing Library (RNTL):** Para pruebas de componentes e integración.
- **Mocks de Infraestructura:** Se utilizarán mocks para simular `expo-sqlite` y validar la capa de persistencia.

---

## 3. Niveles de Prueba

### 3.1 Pruebas Unitarias (Lógica Aislada)

Se enfocan en las piezas más pequeñas y puras del sistema.

- **Entidades:** Validar que los modelos de datos (Board, List, Card) se comporten según las reglas de negocio.
- **Utilities:** Funciones de ordenamiento de tarjetas, formateo de fechas, etc.
- **Zustand Stores:** Verificar que el estado global cambie correctamente tras una acción.

### 3.2 Pruebas de Repositorio (Capa de Datos)

Nivel crítico en KanBee para asegurar el desacoplamiento:

- **Contratos:** Validar que las implementaciones de `infrastructure/repositories/` cumplan con las interfaces de `core/interfaces/`.
- **Integridad de Datos:** Probar que al guardar una Card en SQLite, esta mantenga su `order_index` y relación con la List.

### 3.3 Pruebas de Componentes (UI)

- **Componentes Atómicos:** Verificar renderizado de `Card`, `Button`, `BoardTile`.
- **Formularios:** Validar validaciones de entrada y estados de error.

Reglas para Tests de UI

Los tests de UI deben simular interacciones del usuario usando React Native Testing Library.

Evitar:

Modificar stores de Zustand directamente.

Llamar funciones internas del componente.

Manipular el estado manualmente desde el test.

Preferir:

fireEvent.changeText()

fireEvent.press()

consultas como getByText, getByPlaceholderText, getByTestId.

### Ejemplo de Test de UI

````tsx
it("filters boards when the user types in the search input", async () => {
  renderWithProviders(<BoardsScreen />)

  const input = screen.getByPlaceholderText("Search")

  fireEvent.changeText(input, "kan")

  await waitFor(() => {
    expect(screen.getByText("Kanbee Project")).toBeTruthy()
  })
})

### 3.4 Pruebas de Integración (User Flows)
Simulación de flujos completos del usuario:
- "Crear un tablero -> Añadir una lista -> Crear una tarjeta".
- "Mover una tarjeta de la lista A a la lista B" (Drag & Drop Logic).

---

## 4. Estructura de Archivos
Los tests se ubican en carpetas `__tests__` dentro de cada feature o capa lógica:

```text
src/
 ├── core/entities/__tests__/
 ├── infrastructure/repositories/__tests__/
 ├── features/[feature_name]/__tests__/
 └── components/ui/__tests__/


5. Objetivos de Cobertura (Coverage)
Para mantener la calidad de este portafolio, nos enfocamos en:

Hooks & Logic: 90%

Zustand Stores: 90%

Repositories: 85% (Crítico para la persistencia)

UI Components: 75%

6. Reglas de Oro para la IA
Al generar tests con IA, se deben seguir estas reglas:

No probar librerías externas: No probamos si Expo Router funciona, probamos que nuestra navegación se dispare.

Uso de Mocks: Si un test de componente requiere datos, se debe usar un MockRepository en lugar de llamar a la base de datos real.

Nomenclatura:

ComponentName.test.tsx para componentes.

repositoryName.test.ts para lógica de datos.


Ejecución Continua
Pre-commit: Los tests de la feature afectada deben pasar antes de realizar un commit.

Refactor: Antes de cambiar SQLite por una API, los tests de integración deben estar en verde para asegurar que la UI no se rompa.
````
