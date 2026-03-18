import { create } from 'zustand'

import type { Board } from '@/core/entities/board'
import type { IBoardRepository } from '@/core/interfaces/IBoardRepository'
import { SQLiteBoardRepository } from '@/infrastructure/repositories/SQLiteBoardRepository'
import { MockBoardRepository } from '@/infrastructure/repositories/testing/MockBoardRepository'

type BoardInput = Omit<Board, 'id' | 'createdAt'>

interface BoardStoreState {
  boards: Board[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  isLoading: boolean
  error: string | null
  fetchBoards: (userId: string) => Promise<void>
  addBoard: (board: BoardInput) => Promise<void>
  removeBoard: (id: string) => Promise<void>
}

const defaultRepository = process.env.NODE_ENV === 'test' ? new MockBoardRepository() : new SQLiteBoardRepository()

export const createBoardStore = (repository: IBoardRepository = defaultRepository) => {
  return create<BoardStoreState>((set, get) => ({
    boards: [],
    searchQuery: '',
    isLoading: false,
    error: null,
    setSearchQuery: (query) => set({ searchQuery: query }),

    async fetchBoards(userId: string) {
      set({ isLoading: true, error: null })
      try {
        const result = await repository.getBoards(userId)
        set({ boards: result, isLoading: false })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load boards'
        set({ error: message, isLoading: false })
      }
    },

    async addBoard(boardInput: BoardInput) {
      set({ isLoading: true, error: null })
      try {
        const created = await repository.createBoard(boardInput)
        set((state) => ({
          boards: [...state.boards, created],
          isLoading: false,
        }))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create board'
        set({ error: message, isLoading: false })
      }
    },

    async removeBoard(id: string) {
      set({ isLoading: true, error: null })
      try {
        await repository.deleteBoard(id)
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
          isLoading: false,
        }))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete board'
        set({ error: message, isLoading: false })
      }
    },
  }))
}

export const useBoardStore = createBoardStore()
