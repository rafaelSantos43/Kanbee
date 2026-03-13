# Flujo de Trabajo de IA: KanBee Mobile

Este documento define el protocolo de colaboración entre el desarrollador y las herramientas de IA para garantizar consistencia, calidad y productividad máxima.

## 1. Herramientas de IA
- **Editor Principal:** Cursor AI.
- **Áreas de Aplicación:** Generación de código, refactorización, depuración, creación de tests y documentación técnica.

---

## 2. Proceso de Desarrollo Estructurado

### Paso 1: Lectura de Contexto (Indexación)
Antes de proponer cualquier solución, la IA debe haber "leído" los siguientes archivos maestros:
- `PRD.md` (Requerimientos de producto)
- `architecture.md` (Guía de arquitectura y capas)
- `testing-strategy.md` (Estrategia de pruebas)

### Paso 2: Planificación de la Funcionalidad
La IA debe analizar y proponer un plan antes de escribir:
- Estructura de carpetas necesaria.
- Componentes, hooks y servicios requeridos.
- Impacto en el estado global (Zustand).

### Paso 3: Implementación siguiendo la Arquitectura
El código debe seguir estrictamente las guías de arquitectura (Patrón Repositorio y desacoplamiento de SQLite).

### Paso 4: Generación de Pruebas
No se considera una funcionalidad "terminada" sin sus respectivos tests en:
- Hooks y lógica de negocio.
- Componentes de interfaz.
- Flujos críticos de usuario (Integración).

### Paso 5: Revisión y Refactorización
La IA debe auditar su propio código para:
- Eliminar duplicación.
- Mejorar la legibilidad y el tipado de TypeScript.
- Asegurar la consistencia con el resto del proyecto.

---

## 3. Flujo de Desarrollo de Features (Orden Sugerido)

Para mantener el orden, la IA debe trabajar en esta secuencia:
1. **Definir Dominio:** Crear entidades y tipos en `src/core/entities`.
2. **Definir Contrato:** Crear interfaces en `src/core/interfaces`.
3. **Infraestructura:** Implementar el repositorio en `src/infrastructure/repositories`.
4. **Lógica de Aplicación:** Implementar Hooks y Stores de Zustand.
5. **Interfaz de Usuario:** Crear componentes y pantallas (Expo Router).
6. **Validación:** Escribir tests y refactorizar.

---

## 4. Mejores Prácticas y Limitaciones

### Mejores Prácticas:
- **Pasos cortos:** Trabajar en tareas pequeñas y atómicas. Evitar prompts masivos.
- **Revisión Humana:** El desarrollador siempre debe validar el código generado.
- **Refactorización temprana:** No esperar al final para limpiar el código.

### Limitaciones de la IA (Alertas):
- **Alucinaciones:** La IA puede inventar APIs de Expo o SQLite que no existen.
- **Inconsistencia:** Puede proponer patrones que rompen la arquitectura si no se le recuerda el `architecture.md`.
- **Abstracción Excesiva:** Evitar que la IA cree capas innecesarias que compliquen el código sin beneficio real.

---

## 5. Estrategia de Revisión de Código (GGA)
Cada feature debe ser revisada bajo cuatro criterios:
1. **Cumplimiento Arquitectónico:** ¿Está desacoplado el backend?
2. **Calidad de Código:** ¿Es legible y eficiente?
3. **Cobertura de Tests:** ¿Se cumplen los porcentajes definidos?
4. **Rendimiento:** ¿Mantiene la fluidez visual (60 FPS)?