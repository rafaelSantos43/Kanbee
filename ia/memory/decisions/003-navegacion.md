---
date: 2026-03-17
status: active
tags: [arquitectura, navegación]
---

# Estructura de Navegación

Expo Router con route groups y guardia de autenticación en root `_layout.tsx`.

```
app/
├── (auth)/          # Login y registro
└── (main)/          # Requiere autenticación
    └── (board)/     # Tableros (drawer navigation lateral derecho)
        ├── index    # Lista de tableros
        └── [id]     # Detalle de tablero
```

- La sesión se persiste en AsyncStorage vía Zustand persist.
- El root layout evalúa `useSessionStore.authenticated` para redirigir.
