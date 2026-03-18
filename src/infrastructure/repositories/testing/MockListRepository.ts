import type { List } from '@/core/entities'
import type { IListRepository } from '@/core/interfaces/ListRepository'

export class MockListRepository implements IListRepository {
  private lists: List[] = []
  private idCounter = 0

  async getListsByBoardId(boardId: string): Promise<List[]> {
    return this.lists.filter((l) => l.boardId === boardId).sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getListById(id: string): Promise<List | null> {
    return this.lists.find((l) => l.id === id) ?? null
  }

  async createList(list: Omit<List, 'id' | 'createdAt'>): Promise<List> {
    const newlist: List = {
      id: `mock-id-${++this.idCounter}`,
      title: list.title,
      boardId: list.boardId,
      createdAt: Date.now(),
      orderIndex: list.orderIndex,
    }

    this.lists.push(newlist)
    return newlist
  }

  async updateList(id: string, data: Partial<Pick<List, 'title' | 'orderIndex'>>): Promise<void> {
    const index = this.lists.findIndex((l) => l.id === id)

    if (index !== -1) {
      this.lists[index] = {
        ...this.lists[index],
        ...data,
        updatedAt: Date.now(),
      }
    }
  }

  async deleteList(id: string): Promise<void> {
    this.lists = this.lists.filter((l) => l.id !== id)
  }
}
