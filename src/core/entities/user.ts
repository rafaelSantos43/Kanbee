import { Role } from '@/constants/roles'

export interface User {
  id: string
  username: string
  email: string
  password?: string
  avatar?: string | null
  role: Role
  createdAt: number
  updatedAt?: number
  deletedAt?: number
}
