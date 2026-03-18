import { eq } from 'drizzle-orm'

import type { Board } from '@/core/entities/board'
import type { IBoardRepository } from '@/core/interfaces/IBoardRepository'
import { db } from '@/infrastructure/database/client'
import { boards } from '@/infrastructure/database/schema'

function randomDelay(minMs = 300, maxMs = 600): Promise<void> {
  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return new Promise((resolve) => setTimeout(resolve, duration))
}

async function withFakeLatency<T>(operation: () => Promise<T>): Promise<T> {
  const [result] = await Promise.all([operation(), randomDelay()])
  return result
}

function mapRowToEntity(row: typeof boards.$inferSelect): Board {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    color: row.color ?? undefined,
    isFavorite: row.isFavorite,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt ?? undefined,
  }
}

export class SQLiteBoardRepository implements IBoardRepository {
  async getBoards(userId: string): Promise<Board[]> {
    return withFakeLatency(async () => {
      const rows = await db.select().from(boards).where(eq(boards.userId, userId))
      return rows.map(mapRowToEntity)
    })
  }

  async getBoardById(id: string): Promise<Board | null> {
    return withFakeLatency(async () => {
      const rows = await db.select().from(boards).where(eq(boards.id, id)).limit(1)
      const row = rows[0]
      return row ? mapRowToEntity(row) : null
    })
  }

  async createBoard(board: Omit<Board, 'id' | 'createdAt'>): Promise<Board> {
    return withFakeLatency(async () => {
      const id = crypto.randomUUID?.() ?? `board-${Date.now()}`
      const createdAt = Date.now()

      const [inserted] = await db
        .insert(boards)
        .values({
          id,
          userId: board.userId,
          title: board.title,
          color: board.color ?? null,
          isFavorite: board.isFavorite ?? false,
          createdAt,
        })
        .returning()

      return mapRowToEntity(inserted)
    })
  }

  async updateBoard(id: string, data: Partial<Board>): Promise<void> {
    return withFakeLatency(async () => {
      const updateData: Partial<typeof boards.$inferInsert> = {}

      if (data.title !== undefined) {
        updateData.title = data.title
      }
      if (data.color !== undefined) {
        updateData.color = data.color ?? null
      }
      if (data.isFavorite !== undefined) {
        updateData.isFavorite = data.isFavorite
      }
      if (data.userId !== undefined) {
        updateData.userId = data.userId
      }

      updateData.updatedAt = Date.now()

      if (Object.keys(updateData).length === 0) {
        return
      }

      await db.update(boards).set(updateData).where(eq(boards.id, id))
    })
  }

  async deleteBoard(id: string): Promise<void> {
    return withFakeLatency(async () => {
      await db.delete(boards).where(eq(boards.id, id))
    })
  }
}
