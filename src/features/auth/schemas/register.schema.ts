import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3, 'El usuario requiere al menos 3 caracteres'),
  email: z.email(),
  password: z.string().min(6, 'La contraseña es muy corta'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
