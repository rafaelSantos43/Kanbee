import { Card } from '@/core/entities'
import { ICardRepository } from '@/core/interfaces/ICardRepository'

export class MockCardRepository implements ICardRepository {
  private cards: Card[] = []
  private idCounter = 0

  async getCardsByListId(listId: string): Promise<Card[]> {
    return this.cards.filter((c) => c.listId === listId).sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async getCardById(id: string): Promise<Card | null> {
    return this.cards.find((c) => c.id === id) ?? null
  }

  async createCard(card: Omit<Card, 'id' | 'createdAt'>): Promise<Card> {
    const newCard: Card = {
      ...card,
      id: `mock-id-${++this.idCounter}`,
      createdAt: Date.now(),
      status: card.status ?? 'todo',
      isArchived: card.isArchived ?? false,
    }

    this.cards.push(newCard)
    return newCard
  }
  async updateCard(id: string, data: Partial<Omit<Card, 'id' | 'createdAt'>>): Promise<void> {
    const index = this.cards.findIndex((c) => c.id === id)

    if (index !== -1) {
      this.cards[index] = {
        ...this.cards[index],
        ...data,
        updatedAt: Date.now(),
      }
    }
  }

  async deleteCard(id: string): Promise<void> {
    this.cards = this.cards.filter((c) => c.id !== id)
  }
}
