export interface Board {
  id: string
  userId: string
  title: string
  description?: string
  color?: string
  coverImage?: string
  isFavorite?: boolean
  isArchived?: boolean
  isPublic?: boolean
  createdAt: number
  updatedAt?: number
  archivedAt?: number
}
