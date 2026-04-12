import { Card } from '@/core/entities'
import { ICardRepository } from '@/core/interfaces/ICardRepository'
import { asc, eq } from 'drizzle-orm'
import { db } from '../database/client'
import { cards } from '../database/schema'

function randomDelay(minMs = 300, maxMs = 600): Promise<void> {
  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return new Promise((resolve) => setTimeout(resolve, duration))
}

async function withFakeLatency<T>(operation: () => Promise<T>): Promise<T> {
  const [result] = await Promise.all([operation(), randomDelay()])
  return result
}

function mapRowToEntity(row: typeof cards.$inferSelect): Card {
  return {
    id: row.id,
    listId: row.listId,
    responsibleId: row.responsibleId ?? undefined,
    orderIndex: row.orderIndex,
    title: row.title,
    description: row.description ?? undefined,
    priority: row.priority ?? undefined,
    coverColor: row.coverColor ?? undefined,
    coverImage: row.coverImage ?? undefined,
    dueDate: row.dueDate ?? undefined,
    startDate: row.startDate ?? undefined,
    completedAt: row.completedAt ?? undefined,
    isArchived: row.isArchived ?? false,
    createdAt: row.createdAt,
    status: row.status,
    updatedAt: row.updatedAt ?? undefined,
    archivedAt: row.archivedAt ?? undefined,
  }
}

export class DrizzleCardRepository implements ICardRepository {
  async getCardsByListId(listId: string): Promise<Card[]> {
    return withFakeLatency(async () => {
      const row = await db.select().from(cards).where(eq(cards.listId, listId)).orderBy(asc(cards.orderIndex))
      return row.map(mapRowToEntity)
    })
  }

  async getCardById(id: string): Promise<Card | null> {
    return withFakeLatency(async () => {
      const rows = await db.select().from(cards).where(eq(cards.id, id)).limit(1)
      const row = rows[0]
      return row ? mapRowToEntity(row) : null
    })
  }

  async createCard(card: Omit<Card, 'id' | 'createdAt'>): Promise<Card> {
    return withFakeLatency(async () => {
      const id = crypto.randomUUID?.() ?? `card-${Date.now()}`
      const createdAt = Date.now()

      const [inserted] = await db
        .insert(cards)
        .values({
          id,
          listId: card.listId,
          responsibleId: card.responsibleId ?? null,
          title: card.title,
          description: card.description ?? null,
          status: card.status,
          priority: card.priority ?? null,
          orderIndex: card.orderIndex,
          coverColor: card.coverColor ?? null,
          coverImage: card.coverImage ?? null,
          dueDate: card.dueDate ?? null,
          startDate: card.startDate ?? null,
          completedAt: card.completedAt ?? null,
          isArchived: card.isArchived ?? false,
          createdAt,
          archivedAt: card.archivedAt ?? null,
        })
        .returning()
      return mapRowToEntity(inserted)
    })
  }

  async updateCard(id: string, data: Partial<Omit<Card, 'id' | 'createdAt'>>): Promise<void> {
    return withFakeLatency(async () => {
      const updateData: Partial<typeof cards.$inferInsert> = {}

      if (data.listId !== undefined) {
        updateData.listId = data.listId
      }

      if (data.responsibleId !== undefined) {
        updateData.responsibleId = data.responsibleId ?? null
      }

      if (data.title !== undefined) {
        updateData.title = data.title
      }

      if (data.description !== undefined) {
        updateData.description = data.description ?? null
      }

      if (data.status !== undefined) {
        updateData.status = data.status
      }

      if (data.priority !== undefined) {
        updateData.priority = data.priority ?? null
      }

      if (data.orderIndex !== undefined) {
        updateData.orderIndex = data.orderIndex
      }

      if (data.coverColor !== undefined) {
        updateData.coverColor = data.coverColor ?? null
      }

      if (data.coverImage !== undefined) {
        updateData.coverImage = data.coverImage ?? null
      }

      if (data.dueDate !== undefined) {
        updateData.dueDate = data.dueDate ?? null
      }

      if (data.startDate !== undefined) {
        updateData.startDate = data.startDate ?? null
      }

      if (data.completedAt !== undefined) {
        updateData.completedAt = data.completedAt ?? null
      }

      if (data.isArchived !== undefined) {
        updateData.isArchived = data.isArchived
      }

      if (data.archivedAt !== undefined) {
        updateData.archivedAt = data.archivedAt ?? null
      }

      updateData.updatedAt = Date.now()

      if (Object.keys(updateData).length === 0) {
        return
      }

      await db.update(cards).set(updateData).where(eq(cards.id, id))
    })
  }

  async deleteCard(id: string): Promise<void> {
    return withFakeLatency(async () => {
      await db.delete(cards).where(eq(cards.id, id))
    })
  }
}
