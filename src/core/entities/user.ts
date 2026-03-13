export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role?: 'admin' | 'user'
  createdAt: number
  updatedAt?: number
}
