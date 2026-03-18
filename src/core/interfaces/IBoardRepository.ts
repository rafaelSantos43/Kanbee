import type { Board } from '@/core/entities/board'

export interface IBoardRepository {
  getBoards(userId: string): Promise<Board[]>
  getBoardById(id: string): Promise<Board | null>
  createBoard(board: Omit<Board, 'id' | 'createdAt'>): Promise<Board>
  updateBoard(id: string, data: Partial<Board>): Promise<void>
  deleteBoard(id: string): Promise<void>
}
