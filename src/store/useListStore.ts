import { List } from '@/core/entities'
import { IListRepository } from '@/core/interfaces/ListRepository'
import { DrizzleListRepository } from '@/infrastructure/repositories/DrizzleListRepository'
import { MockListRepository } from '@/infrastructure/repositories/testing/MockListRepository'
import { create } from 'zustand'

type ListInput = Omit<List, 'id' | 'createdAt'>

interface ListStoreState {
  lists: List[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  isLoading: boolean
  error: string | null
  fetchLists: (boardId: string) => Promise<void>
  addList: (list: ListInput) => Promise<void>
  updateList: (id: string, data: Partial<Pick<List, 'title' | 'orderIndex'>>) => Promise<void>
  removeList: (id: string) => Promise<void>
}

const defaultRepository = process.env.NODE_ENV === 'test' ? new MockListRepository() : new DrizzleListRepository()

export const createListStore = (repository: IListRepository = defaultRepository) => {
  return create<ListStoreState>((set, get) => ({
    lists: [],
    searchQuery: '',
    isLoading: false,
    error: null,
    setSearchQuery: (query) => set({ searchQuery: query }),

    async fetchLists(boardId: string) {
      set({ isLoading: true, error: null })

      try {
        const result = await repository.getListsByBoardId(boardId)
        set({ lists: result, isLoading: false })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load lists'
        set({ error: message, isLoading: false })
      }
    },

    async addList(listInput: ListInput) {
      set({ isLoading: true, error: null })

      try {
        const created = await repository.createList(listInput)
        set((state) => ({
          lists: [...state.lists, created],
          isLoading: false,
        }))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create list'
        set({ error: message, isLoading: false })
      }
    },

    async updateList(id: string, data: Partial<Pick<List, 'title' | 'orderIndex'>>) {
      set({ isLoading: true, error: null })

      try {
        await repository.updateList(id, data)

        set((state) => ({
          lists: state.lists.map((list) => (list.id === id ? { ...list, ...data, updatedAt: Date.now() } : list)),
          isLoading: false,
        }))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update list'
        set({ error: message, isLoading: false })
      }
    },

    async removeList(id: string) {
      set({ isLoading: true, error: null })

      try {
        await repository.deleteList(id)
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
          isLoading: false,
        }))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete list'
        set({ error: message, isLoading: false })
      }
    },
  }))
}

export const useListStore = createListStore()
