import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3, 'El usuario requiere al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña es muy corta'),
})

export type LoginFormData = z.infer<typeof loginSchema>
