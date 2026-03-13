export interface Board {
  id: string
  userId: string
  title: string
  color?: string
  isFavorite?: boolean
  createdAt: number
  updatedAt?: number
}
