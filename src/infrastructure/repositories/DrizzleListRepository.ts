import { List } from '@/core/entities'
import { IListRepository } from '@/core/interfaces/ListRepository'
import { asc, eq } from 'drizzle-orm'
import { db } from '../database/client'
import { lists } from '../database/schema'

function randomDelay(minMs = 300, maxMs = 600): Promise<void> {
  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return new Promise((resolve) => setTimeout(resolve, duration))
}

async function withFakeLatency<T>(operation: () => Promise<T>): Promise<T> {
  const [result] = await Promise.all([operation(), randomDelay()])
  return result
}

function mapRowToEntity(row: typeof lists.$inferSelect): List {
  return {
    id: row.id,
    boardId: row.boardId,
    orderIndex: row.orderIndex,
    title: row.title,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt ?? undefined,
  }
}

export class DrizzleListRepository implements IListRepository {
  async getListsByBoardId(boardId: string): Promise<List[]> {
    return withFakeLatency(async () => {
      const row = await db.select().from(lists).where(eq(lists.boardId, boardId)).orderBy(asc(lists.orderIndex))
      return row.map(mapRowToEntity)
    })
  }

  async getListById(id: string): Promise<List | null> {
    return withFakeLatency(async () => {
      const rows = await db.select().from(lists).where(eq(lists.id, id)).limit(1)
      const row = rows[0]
      return row ? mapRowToEntity(row) : null
    })
  }

  async createList(list: Omit<List, 'id' | 'createdAt'>): Promise<List> {
    return withFakeLatency(async () => {
      const id = crypto.randomUUID?.() ?? `list-${Date.now()}`
      const createdAt = Date.now()

      const [inserted] = await db
        .insert(lists)
        .values({
          id,
          boardId: list.boardId,
          orderIndex: list.orderIndex,
          title: list.title,
          createdAt,
        })
        .returning()

      return mapRowToEntity(inserted)
    })
  }

  async updateList(id: string, data: Partial<Pick<List, 'title' | 'orderIndex'>>): Promise<void> {
    return withFakeLatency(async () => {
      const updateData: Partial<typeof lists.$inferInsert> = {}
      if (data.title !== undefined) {
        updateData.title = data.title
      }

      if (data.orderIndex !== undefined) {
        updateData.orderIndex = data.orderIndex
      }

      updateData.updatedAt = Date.now()

      if (Object.keys(updateData).length === 0) {
        return
      }

      await db.update(lists).set(updateData).where(eq(lists.id, id))
    })
  }

  async deleteList(id: string): Promise<void> {
    return withFakeLatency(async () => {
      await db.delete(lists).where(eq(lists.id, id))
    })
  }
}
