# Spec: Autenticación (Local Session)

## Descripción
KanBee requiere un sistema de autenticación para persistir el perfil del usuario localmente en SQLite, permitiendo una experiencia personalizada sin un backend externo inicial.

## Requerimientos Funcionales
- **Registro:** El usuario puede crear una cuenta (Username/Password) que se guarda en la tabla `users`.
- **Login:** Validación de credenciales contra la base de datos local.
- **Persistencia:** Uso de `expo-sqlite` para mantener la sesión activa al reiniciar la app.
- **Logout:** Limpiar el estado de Zustand y la sesión en disco.

## Reglas de Negocio
- La contraseña debe tener al menos 6 caracteres.
- El nombre de usuario debe ser único en la base de datos local.

## Capas involucradas
- **Infra:** `AuthRepository` (SQLite).
- **Store:** `useAuthStore` (Zustand).
- **UI:** Pantallas `/login` y `/register`.