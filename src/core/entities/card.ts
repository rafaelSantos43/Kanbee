export type CardStatus = 'todo' | 'in-progress' | 'done' | 'blocked';

export interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  status: CardStatus;
  orderIndex: number;
  createdAt: number;
  updatedAt?: number;
}

