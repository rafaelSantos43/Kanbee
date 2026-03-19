import { Card } from '../entities'

export interface ICardRepository {
  getCardsByListId(listId: string): Promise<Card[]>
  createCard(card: Omit<Card, 'id' | 'createdAt'>): Promise<Card>
  getCardById(id: string): Promise<Card | null>
  updateCard(id: string, data: Partial<Pick<Card, 'title' | 'description' | 'orderIndex' | 'listId' | 'status'>>): Promise<void>
  deleteCard(id: string): Promise<void>
}
