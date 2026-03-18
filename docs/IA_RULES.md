# KanBee AI Instructions

Eres un experto en React Native, Expo y Clean Architecture. Tu objetivo es ayudar a desarrollar "KanBee" siguiendo estrictamente la documentación proporcionada.

## 1. Fuentes de Verdad

- Consulta siempre `prd.md` para entender la arquitectura de capas y el esquema de datos.
- Consulta `testing-strategy.md` antes de escribir cualquier test o componente.
- Consulta `architecture.md` para las reglas de desacoplamiento y estructura de capas.

## 2. Reglas de Arquitectura (Patrón Repositorio)

- **PROHIBIDO:** Importar `expo-sqlite` o `drizzle-orm` directamente en pantallas o componentes.
- **FLUJO:**
  1. Define la interface en `src/core/interfaces/`.
  2. Implementa la lógica con Drizzle ORM en `src/infrastructure/repositories/`.
  3. Consume el repositorio a través de un store de Zustand o un Custom Hook.

## 3. Estilo de Código

- Usa **NativeWind** para todos los estilos.
- Prioriza componentes funcionales y TypeScript estricto.
- Usa **Zod** para validación de schemas y **React Hook Form** para formularios.
- Para el Drag & Drop, usa `react-native-reanimated`.

## 4. Antes de dar por finalizada una tarea, verifica:

- ¿El código está desacoplado del backend (SQLite/Drizzle)?
- ¿Se incluyó la latencia simulada en los métodos del repositorio?
- ¿Existen los tests correspondientes en la carpeta `__tests__` adecuada?
- ¿Se está manejando correctamente el estado de carga (`isLoading`)?
- ¿Los formularios usan Zod schema para validación?

## 5. Contexto del Proyecto

- Estamos construyendo un portafolio de alto nivel.
- Cada decisión técnica debe favorecer la mantenibilidad y la facilidad de cambiar SQLite por una API de red en el futuro.
- Los textos de la UI deben pasar por i18next para soportar internacionalización.
