export type CardStatus = 'todo' | 'in-progress' | 'done' | 'blocked'
export type CardPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Card {
  id: string
  listId: string
  responsibleId?: string
  title: string
  description?: string
  status: CardStatus
  priority?: CardPriority
  orderIndex: number
  coverColor?: string
  coverImage?: string
  dueDate?: number
  startDate?: number
  completedAt?: number
  isArchived?: boolean
  createdAt: number
  updatedAt?: number
  archivedAt?: number
}

