# Testing Strategy: KanBee Mobile

Este documento define la estrategia de pruebas para el proyecto **KanBee**. El enfoque principal es asegurar que la lógica de negocio y la persistencia funcionen correctamente bajo una arquitectura desacoplada.

## 1. Filosofía de Testing

En KanBee, probamos **comportamientos, no implementaciones**. Dado que usamos el Patrón Repositorio, nuestras pruebas deben garantizar que la UI reaccione correctamente sin importar si los datos vienen de SQLite o de una memoria volátil.

---

## 2. Herramientas de Testing

- **Jest:** Framework principal de ejecución de pruebas (preset `jest-expo`).
- **React Native Testing Library (RNTL):** Para pruebas de componentes e integración.
- **Mocks de Infraestructura:** Configurados en `jest.setup.js` para expo-router, expo-sqlite, AsyncStorage, react-navigation y otros módulos nativos.

---

## 3. Niveles de Prueba

### 3.1 Pruebas Unitarias (Lógica Aislada)

Se enfocan en las piezas más pequeñas y puras del sistema.

- **Entidades:** Validar que los modelos de datos (Board, List, Card) se comporten según las reglas de negocio.
- **Utilities:** Funciones de ordenamiento, formateo de fechas, hash de contraseñas, etc.
- **Zustand Stores:** Verificar que el estado global cambie correctamente tras una acción.

### 3.2 Pruebas de Repositorio (Capa de Datos)

Nivel crítico en KanBee para asegurar el desacoplamiento:

- **Contratos:** Validar que las implementaciones cumplan con las interfaces `IAuthRepository` e `IBoardRepository`.
- **Integridad de Datos:** Probar que al guardar un Board o Card, se mantengan las relaciones y el `orderIndex`.

### 3.3 Pruebas de Componentes (UI)

- **Componentes compartidos:** Verificar renderizado de `Screen`, `KText`, `KTextInput`.
- **Componentes de feature:** Verificar componentes específicos de boards y auth.
- **Formularios:** Validar integración con Zod schemas y estados de error.

#### Reglas para Tests de UI

Los tests de UI deben simular interacciones del usuario usando RNTL.

**Evitar:**
- Modificar stores de Zustand directamente.
- Llamar funciones internas del componente.
- Manipular el estado manualmente desde el test.

**Preferir:**
- `fireEvent.changeText()`
- `fireEvent.press()`
- Consultas como `getByText`, `getByPlaceholderText`, `getByTestId`.

#### Ejemplo de Test de UI

```tsx
it("filters boards when the user types in the search input", async () => {
  render(<BoardsScreen />);

  const input = screen.getByPlaceholderText("Search");
  fireEvent.changeText(input, "kan");

  await waitFor(() => {
    expect(screen.getByText("Kanbee Project")).toBeTruthy();
  });
});
```

### 3.4 Pruebas de Integración (User Flows)

Simulación de flujos completos del usuario:

- "Crear un tablero -> Añadir una lista -> Crear una tarjeta".
- "Mover una tarjeta de la lista A a la lista B" (Drag & Drop Logic).

---

## 4. Estructura de Archivos

Los tests se ubican en carpetas `__tests__/` dentro de cada capa lógica:

```text
src/
├── core/entities/__tests__/
├── infrastructure/repositories/__tests__/
├── features/[feature_name]/screens/__tests__/
└── components/__tests__/
```

---

## 5. Objetivos de Cobertura (Coverage)

| Capa | Objetivo |
|---|---|
| Hooks & Logic | 90% |
| Zustand Stores | 90% |
| Repositories | 85% |
| UI Components | 75% |

---

## 6. Reglas para Generación de Tests con IA

- **No probar librerías externas:** No probamos si Expo Router funciona; probamos que nuestra navegación se dispare.
- **Uso de Mocks:** Si un test de componente requiere datos, se debe usar un MockRepository en lugar de llamar a la base de datos real.
- **Nomenclatura:**
  - `ComponentName.test.tsx` para componentes.
  - `MockRepositoryName.test.ts` para repositorios.

---

## 7. Ejecución

```bash
# Todos los tests
bun test

# Watch mode
bun test -- --watch

# Coverage
bun test -- --coverage

# Test específico
bun test -- --testPathPattern="Board"
```

Pre-commit: Los tests de la feature afectada deben pasar antes de realizar un commit.
