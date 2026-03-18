import { Role } from '@/constants/roles'
import { IAuthRepository } from '@/core/interfaces/IAuthRepository'
import { db } from '@/infrastructure/database/client'
import { eq, or } from 'drizzle-orm'
import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'
import { users } from '../database/schema'
export class DrizzleAuthRepository implements IAuthRepository {
  async register({
    username,
    email,
    password,
    role,
    avatar,
  }: {
    username: string
    email: string
    password: string
    avatar: string | null
    role: Role
  }) {
    const [newUser] = await db
      .insert(users)
      .values({
        id: uuid(),
        username,
        email,
        password,
        avatar: avatar ?? null,
        role,
        createdAt: Date.now(),
      })
      .returning()

    return newUser
  }

  async login({ username: identifier, password }: { username: string; password: string }) {
    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.username, identifier), eq(users.email, identifier)))

    if (!user || user.password !== password) {
      throw new Error('Credenciales incorrectas')
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
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
