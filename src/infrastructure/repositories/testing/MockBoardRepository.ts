// src/infrastructure/repositories/testing/MockBoardRepository.ts

import type { Board } from '@/core/entities/board'
import type { IBoardRepository } from '@/core/interfaces/IBoardRepository'

export class MockBoardRepository implements IBoardRepository {
  private boards: Board[] = []
  private idCounter = 0

  async getBoards(): Promise<Board[]> {
    return this.boards
  }

  async getBoardById(id: string): Promise<Board | null> {
    return this.boards.find((b) => b.id === id) ?? null
  }

  async createBoard(board: Omit<Board, 'id' | 'createdAt'>): Promise<Board> {
    const newBoard: Board = {
      ...board,
      id: `mock-id-${++this.idCounter}`,
      createdAt: Date.now(),
      isFavorite: board.isFavorite ?? false,
    }

    this.boards.push(newBoard)
    return newBoard
  }

  async updateBoard(id: string, data: Partial<Board>): Promise<void> {
    const index = this.boards.findIndex((b) => b.id === id)

    if (index !== -1) {
      this.boards[index] = {
        ...this.boards[index],
        ...data,
        updatedAt: Date.now(),
      }
    }
  }

  async deleteBoard(id: string): Promise<void> {
    this.boards = this.boards.filter((b) => b.id !== id)
  }
}
