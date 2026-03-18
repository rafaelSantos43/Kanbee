# KanBee Context Memory (Engram)

Sistema de memoria de contexto persistente para mantener coherencia entre sesiones de IA.

## Estructura

```
ia/memory/
├── README.md              # Este archivo
├── decisions/             # Decisiones técnicas y arquitectónicas
├── progress/              # Estado actual de features y progreso
└── issues/                # Bugs conocidos, deuda técnica, problemas pendientes
```

## Cómo usar

### Para la IA

Al inicio de cada sesión, lee los archivos de este directorio para obtener contexto. Al finalizar, actualiza los archivos que hayan cambiado.

### Para el desarrollador

- Agrega archivos manualmente cuando tomes decisiones fuera de la sesión de IA.
- Elimina entradas obsoletas para mantener el contexto limpio.

## Convención de archivos

Cada archivo usa este formato:

```markdown
---
date: YYYY-MM-DD
status: active | resolved | deprecated
tags: [arquitectura, testing, ui, datos, etc.]
---

Contenido de la memoria.
```
