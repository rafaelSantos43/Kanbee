import { Role } from '@/constants/roles';
import { IAuthRepository } from '../../../core/interfaces/IAuthRepository';

export class MockAuthRepository implements IAuthRepository {
  private users: { id: string; username: string; password: string }[] = []
  private currentUser: { id: string; username: string } | null = null

  async register({
    username,
    password,
  }: {
    username: string
    email: string
    password: string
    avatar: string | null
    role: Role
  }): Promise<{ id: string; username: string }> {
    const exists = this.users.find((u) => u.username === username)

    if (exists) {
      throw new Error('El nombre de usurio ya esta en uso')
    }

    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      password,
    }

    this.users.push(newUser)

    return { id: newUser.id, username: newUser.username }
  }

  async login({
    username,
    password,
  }: {
    username: string
    password: string
  }): Promise<{ id: string; username: string }> {
    const user = this.users.find((u) => u.username === username && u.password === password)

    if (!user) {
      throw new Error('Credenciales inválidas.')
    }

    this.currentUser = { id: user.id, username: user.username }
    return this.currentUser
  }

  async getCurrentUser(id: string): Promise<{ id: string } | null> {
    return this.currentUser
  }

  async logout(): Promise<void> {
    this.currentUser = null
  }
}
