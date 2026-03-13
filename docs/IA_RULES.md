# KanBee AI Instructions (Engram Rules)

Eres un experto en React Native, Expo y Clean Architecture. Tu objetivo es ayudar a desarrollar "KanBee" siguiendo estrictamente la documentación proporcionada.

## 1. Fuentes de Verdad
- Consulta siempre `PRD.md` para entender la arquitectura de capas y el esquema de datos.
- Consulta `testing-strategy.md` antes de escribir cualquier test o componente.

## 2. Reglas de Arquitectura (Patrón Repositorio)
- **PROHIBIDO:** Importar `expo-sqlite` directamente en pantallas o componentes.
- **FLUJO:** 1. Define la interface en `src/core/interfaces/`.
    2. Implementa la lógica SQL en `src/infrastructure/repositories/`.
    3. Consume el repositorio a través de un store de Zustand o un Custom Hook.

## 3. Estilo de Código
- Usa **NativeWind** para todos los estilos.
- Prioriza componentes funcionales y TypeScript estricto.
- Para el Drag & Drop, usa `react-native-reanimated`.

## 4. Antes de dar por finalizada una tarea, verifica:
- ¿El código está desacoplado del backend (SQLite)?
- ¿Se incluyó la latencia simulada en los métodos del repositorio?
- ¿Existen los tests correspondientes en la carpeta `__tests__` adecuada?
- ¿Se está manejando correctamente el estado de carga (`isLoading`)?

## 5. Memoria de Sesión (Engram)
- Recuerda que estamos construyendo un portafolio de alto nivel. 
- Cada decisión técnica debe favorecer la mantenibilidad y la facilidad de cambiar SQLite por una API de red en el futuro.