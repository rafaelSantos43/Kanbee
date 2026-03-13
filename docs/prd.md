# PRD: KanBee Mobile - AI 

## 1. Resumen (Overview)
**KanBee** es un proyecto experimental cuyo objetivo es reconstruir una aplicación de gestión de proyectos estilo Kanban utilizando una arquitectura moderna, prácticas de "testing-first" y desarrollo asistido por IA de última generación.

El proyecto busca:
* **Validar estrategias de desarrollo con IA:** Utilizando el flujo Spec-Driven Design (SDD).
* **Arquitectura Desacoplada:** Implementar un backend local (SQLite) que sea intercambiable por una API sin afectar la UI.
* **Calidad desde el inicio:** Integrar pruebas unitarias y de integración en cada funcionalidad.
* **Medir la productividad:** Evaluar el impacto de herramientas como Cursor y Engram en el ciclo de vida del software.

La aplicación se desarrolla con **React Native + Expo**, utilizando **Expo Router** para la navegación basada en archivos.

---

## 2. Stack Tecnológico
* **Mobile Framework:** React Native & Expo (SDK 50+).
* **Navegación:** Expo Router (File-based).
* **Gestión de Estado:** Zustand.
* **Capa de Datos:** Patrón Repositorio con **SQLite (expo-sqlite)** para persistencia local.
* **Estilos:** NativeWind (Tailwind CSS).
* **Testing:** Jest & React Native Testing Library.
* **Herramientas IA:** Cursor (IDE), Engram (Context Memory), Gentleman Guardian Angel (Code Review).

---

## 3. Arquitectura
El proyecto sigue una arquitectura **basada en funcionalidades (features)** y **limpia (Clean Architecture)** para mejorar la escalabilidad y el desacoplamiento.

[Image of mobile app clean architecture layers]

### Estructura del Proyecto
```text
src/
 ├ app/               # Rutas de Expo Router (Screens)
 ├ core/              # El corazón del negocio
 │   ├ entities/      # Modelos de datos (Board, List, Card)
 │   └ interfaces/    # Contratos de Repositorios (IBoardRepository)
 ├ infrastructure/    # Implementaciones técnicas
 │   ├ database/      # Configuración de SQLite
 │   └ repositories/  # Implementación SQL de los contratos
 ├ features/          # Módulos: boards, cards, auth, notifications
 ├ components/        # UI atómica y compartida
 ├ store/             # Zustand stores
 └ shared/            # Hooks, utils y constantes globales

4. Funcionalidades Principales (Core Features)
4.1 Autenticación (Simulada)
Permite gestionar la sesión del usuario de forma local.

Funciones: Login, Logout, Persistencia de sesión en SQLite.

Rutas: /login, /register.

4.3 Listas y Tarjetas (Kanban Logic)
La esencia de KanBee es el flujo de tareas.

Funciones: Crear listas dentro de tableros, crear tarjetas, mover tarjetas entre listas (Drag & Drop), cambiar estados.

Estados de Tarjeta: todo, in-progress, done, blocked.

4.4 Persistencia con Latencia Simulada
Para demostrar robustez en entrevistas, el repositorio local simulará un retraso de red (ej. 400ms) para validar estados de carga (loading/shimmer effects).


5. Navegación
Estructura de rutas con Expo Router:

Plaintext
(app)/
 ├── (auth)/
 │    ├── login
 │    └── register
 └── (tabs)/
      ├── index (Lista de Tableros)
      ├── search
      └── profile
6. Estrategia de Testing
Se implementa el testing desde el inicio del desarrollo (TDD asistido).

Unit Tests: Hooks, Stores de Zustand y Utilidades.

Repository Tests: Validación de queries SQL y contratos.

Component Tests: Verificación de renderizado y lógica de UI con RNTL.

Integration Tests: Flujos de usuario (ej: "Crear un tablero y añadir una tarjeta").

7. Workflow de Desarrollo con IA
El desarrollo sigue el ciclo:
Especificación (PRD) → Contrato (Interface) → Implementación (Repo/UI) → Tests → Refactorización (GGA).

Se utiliza Engram para guardar decisiones técnicas:

"Cualquier cambio en la UI debe seguir los tokens de diseño definidos en NativeWind y guardarse en la memoria de contexto de la IA."

8. Métricas del Experimento
Para el portafolio, se medirán los siguientes KPIs:

Productividad: Tiempo de entrega de features con vs sin IA.

Mantenibilidad: Facilidad de cambiar la capa de infrastructure (SQLite) por una API real.

Calidad: Porcentaje de cobertura de código y ausencia de bugs críticos en el flujo Kanban.