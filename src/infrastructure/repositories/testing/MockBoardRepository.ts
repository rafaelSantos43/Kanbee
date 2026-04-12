// src/infrastructure/repositories/testing/MockBoardRepository.ts

import type { Board } from '@/core/entities/board'
import type { IBoardRepository } from '@/core/interfaces/IBoardRepository'

export class MockBoardRepository implements IBoardRepository {
  private boards: Board[] = []
  private idCounter = 0

  async getBoards(userId: string): Promise<Board[]> {
    return this.boards.filter((b) => b.userId === userId)
  }

  async getBoardById(id: string): Promise<Board | null> {
    return this.boards.find((b) => b.id === id) ?? null
  }

  async createBoard(board: Omit<Board, 'id' | 'createdAt'>): Promise<Board> {
    const newBoard: Board = {
      ...board,
      id: `mock-id-${++this.idCounter}`,
      createdAt: Date.now(),
      description: board.description ?? undefined,
      coverImage: board.coverImage ?? undefined,
      isFavorite: board.isFavorite ?? false,
      isArchived: board.isArchived ?? false,
      isPublic: board.isPublic ?? false,
      archivedAt: board.archivedAt ?? undefined,
    }

    this.boards.push(newBoard)
    return newBoard
  }

  async updateBoard(id: string, data: Partial<Omit<Board, 'id' | 'createdAt'>>): Promise<void> {
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
