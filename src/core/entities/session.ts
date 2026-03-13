import { User } from './user'

export interface Session {
  user: User | null
  token?: string
  authenticated: boolean
  hasSeenTasksHint: boolean
}
