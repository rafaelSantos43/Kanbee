---
date: 2026-03-17
status: active
tags: [arquitectura, datos]
---

# Patrón Repositorio

La capa de datos usa el patrón repositorio para desacoplar la persistencia de la UI.

## Contratos actuales

| Interfaz | Implementación | Mock |
|---|---|---|
| `IAuthRepository` | `DrizzleAuthRepository` | `MockAuthRepository` |
| `IBoardRepository` | `SQLiteBoardRepository` | `MockBoardRepository` |

## Reglas

- Las interfaces van en `src/core/interfaces/`.
- Las implementaciones van en `src/infrastructure/repositories/`.
- Los mocks van en `src/infrastructure/repositories/testing/`.
- Los stores de Zustand seleccionan mock o real según `NODE_ENV`.
- Todo método de repositorio incluye latencia simulada (300-600ms).
