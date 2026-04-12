export interface List {
  id: string
  boardId: string
  title: string
  orderIndex: number
  isArchived?: boolean
  createdAt: number
  updatedAt?: number
  archivedAt?: number
}

