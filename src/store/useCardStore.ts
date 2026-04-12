import { Card } from "@/core/entities";
import { ICardRepository } from "@/core/interfaces/ICardRepository";
import { DrizzleCardRepository } from "@/infrastructure/repositories/DrizzleCardRepository";
import { MockCardRepository } from "@/infrastructure/repositories/testing/MockCardRepository";
import { create } from "zustand";

type CardInput = Omit<Card, "id" | "createdAt">;

interface CardStoreState {
  cards: Card[];
  card: Card;
  isLoading: boolean;
  error: string | null;
  fetchCards(listId: string): Promise<void>;
  fetchCardById(cardId: string): Promise<void>;
  addCard(card: CardInput): Promise<void>;
  updateCard(
    id: string,
    data: Partial<Omit<Card, "id" | "createdAt">>,
  ): Promise<void>;
  moveCard(cardId: string, toListId: string, toIndex: number): Promise<void>;
  removeCard(id: string): Promise<void>;
}

const defaultRepository =
  process.env.NODE_ENV === "test"
    ? new MockCardRepository()
    : new DrizzleCardRepository();

export const createCardStore = (
  repository: ICardRepository = defaultRepository,
) => {
  return create<CardStoreState>((set, get) => ({
    cards: [],
    card: {
      id: "",
      title: "",
      description: "",
      listId: "",
      status: "todo",
      orderIndex: 0,
      isArchived: false,
      createdAt: 0,
      updatedAt: 0,
    },
    isLoading: false,
    error: null,
    async fetchCards(listId: string) {
      set({ isLoading: true, error: null });

      try {
        const result = await repository.getCardsByListId(listId);
        set((state) => ({
          cards: [...state.cards.filter((c) => c.listId !== listId), ...result],
          isLoading: false,
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load Cards";
        set({ error: message, isLoading: false });
      }
    },

    async fetchCardById(cardId) {
      set({ isLoading: true, error: null });

      try {
        const result = await repository.getCardById(cardId);
        set((state) => ({
          card: { ...state.card, ...result },
          isLoading: false,
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load Card";
        set({ error: message, isLoading: false });
      }
    },

    async addCard(cardInput: CardInput) {
      set({ isLoading: true, error: null });
      try {
        const create = await repository.createCard(cardInput);
        set((state) => ({
          cards: [...state.cards, create],
          isLoading: false,
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create Cards";
        set({ error: message, isLoading: false });
      }
    },

    async updateCard(
      id: string,
      data: Partial<Omit<Card, "id" | "createdAt">>,
    ) {
      set({ isLoading: true, error: null });

      try {
        await repository.updateCard(id, data);

        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, ...data, updatedAt: Date.now() } : card,
          ),
          isLoading: false,
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update Card";
        set({ error: message, isLoading: false });
      }
    },

    async moveCard(cardId: string, toListId: string, toIndex: number) {
      const state = get();
      const movedCard = state.cards.find((c) => c.id === cardId);
      if (!movedCard) return;

      const fromListId = movedCard.listId;
      const fromIndex = movedCard.orderIndex;

      // Si es la misma lista y la misma posición, no hacer nada
      if (fromListId === toListId && fromIndex === toIndex) return;

      // Construir el nuevo orden de la lista destino
      const targetCards = state.cards
        .filter((c) => c.listId === toListId && c.id !== cardId)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      // Insertar en la posición correcta
      const clampedIndex = Math.min(toIndex, targetCards.length);
      targetCards.splice(clampedIndex, 0, movedCard);

      // Reasignar orderIndex secuencial
      const updates: { id: string; listId: string; orderIndex: number }[] = [];
      targetCards.forEach((c, i) => {
        updates.push({ id: c.id, listId: toListId, orderIndex: i });
      });

      // Si cambió de lista, reordenar la lista origen también
      if (fromListId !== toListId) {
        const sourceCards = state.cards
          .filter((c) => c.listId === fromListId && c.id !== cardId)
          .sort((a, b) => a.orderIndex - b.orderIndex);

        sourceCards.forEach((c, i) => {
          updates.push({ id: c.id, listId: fromListId, orderIndex: i });
        });
      }

      // Update optimista local
      set((s) => ({
        cards: s.cards.map((c) => {
          const update = updates.find((u) => u.id === c.id);
          if (update)
            return {
              ...c,
              listId: update.listId,
              orderIndex: update.orderIndex,
              updatedAt: Date.now(),
            };
          return c;
        }),
      }));

      // Persistir en DB
      try {
        for (const update of updates) {
          await repository.updateCard(update.id, {
            listId: update.listId,
            orderIndex: update.orderIndex,
          });
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to move card";
        set({ error: message });
      }
    },

    async removeCard(id: string) {
      set({ isLoading: true, error: null });

      try {
        await repository.deleteCard(id);
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete card";
        set({ error: message, isLoading: false });
      }
    },
  }));
};

export const useCardStore = createCardStore();
