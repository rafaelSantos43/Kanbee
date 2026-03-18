---
date: 2026-03-17
status: active
tags: [bug, seguridad, auth]
---

# Comparación de contraseñas inconsistente

`DrizzleAuthRepository.login()` compara la contraseña en texto plano (`user.password !== password`), pero el hook `useLogin` hashea con SHA256 antes de enviar.

Esto puede causar que el login falle si la contraseña se almacenó sin hash, o viceversa.

## Solución sugerida

Asegurar que tanto el registro como el login usen el mismo flujo: hashear antes de almacenar y comparar hashes.
