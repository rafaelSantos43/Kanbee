import { IAuthRepository } from '@/core/interfaces/IAuthRepository'
import { db } from '@/infrastructure/database/client'
import { eq, or } from 'drizzle-orm'
import { users } from '../database/schema'

export class DrizzleAuthRepository implements IAuthRepository {
  async register(username: string, email: string, password: string, avatar?: string) {
    // 1. Insertar en la base de datos
    // Nota: Aquí deberías hashear la password antes (ej: con bcrypt)
    const [newUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        username,
        email,
        passwordHash: password, // ¡Hasheala en producción!
        avatar: avatar ?? null,
        createdAt: Date.now(),
      })
      .returning()

    return newUser
  }

  async login(identifier: string, password: string) {
    // 2. Buscar por username O por email
    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.username, identifier), eq(users.email, identifier)))

    if (!user || user.passwordHash !== password) {
      throw new Error('Credenciales incorrectas')
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    }
  }

  async getCurrentUser(userId: string) {
    const [user] = await db.select().from(users).where(eq(users.id, userId))

    return user ?? null
  }

  async logout(): Promise<void> {
    // En una API con JWT, el logout suele manejarse en el cliente
    // borrando el token, o en el servidor invalidándolo en una lista negra.
    console.log('Sesión cerrada')
  }
}
