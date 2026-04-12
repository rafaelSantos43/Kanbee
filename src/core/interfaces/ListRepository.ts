import type { List } from '@/core/entities/list'

export interface IListRepository {
  getListsByBoardId(boardId: string): Promise<List[]>
  createList(list: Omit<List, 'id' | 'createdAt'>): Promise<List>
  getListById(id: string): Promise<List | null>
  updateList(id: string, data: Partial<Pick<List, 'title' | 'orderIndex' | 'isArchived' | 'archivedAt'>>): Promise<void>
  deleteList(id: string): Promise<void>
}
