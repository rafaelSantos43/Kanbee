import { Role } from '@/constants/roles'

/**
 * IAuthRepository defines the contract for authentication operations.
 * Implementations handle user registration, login, and credential validation.
 */
export interface IAuthRepository {
  /**
   * Registers a new user with username and password.
   * @throws Error if username already exists or validation fails
   */
  register({
    username,
    email,
    password,
    avatar,
    role,
  }: {
    username: string
    email: string
    password: string
    avatar: string | null
    role: Role
  }): Promise<{ id: string; username: string }>

  /**
   * Authenticates user with username and password.
   * @returns User object if credentials are valid
   * @throws Error if credentials are invalid
   */
  login({ username, password }: { username: string; password: string }): Promise<{ id: string; username: string }>

  /**
   * Retrieves the currently authenticated user.
   * @returns User object or null if no user is authenticated
   */
  getCurrentUser(id: string): Promise<{ id: string } | null>

  /**
   * Logs out the current user.
   */
  logout(): Promise<void>
}
