import type { ICardRepository } from '@/core/interfaces/ICardRepository'
import { MockCardRepository } from '@/infrastructure/repositories/testing/MockCardRepository'
import { act, renderHook, waitFor } from '@testing-library/react-native'

jest.mock('@/infrastructure/repositories/DrizzleCardRepository', () => ({
  DrizzleCardRepository: jest.fn(),
}))

import { createCardStore } from '../useCardStore'

describe('useCardStore', () => {
  let mockRepository: ICardRepository

  beforeEach(() => {
    mockRepository = new MockCardRepository()
  })

  it('debería inicializar con estado vacío', () => {
    const store = createCardStore(mockRepository)
    const { result } = renderHook(() => store())

    expect(result.current.cards).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  describe('fetchCards', () => {
    it('debería cargar cards desde el repositorio', async () => {
      await mockRepository.createCard({
        listId: 'list-1',
        title: 'Card 1',
        status: 'todo',
        orderIndex: 0,
      })
      await mockRepository.createCard({
        listId: 'list-1',
        title: 'Card 2',
        status: 'in-progress',
        orderIndex: 1,
      })

      const store = createCardStore(mockRepository)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.fetchCards('list-1')
      })

      expect(result.current.cards).toHaveLength(2)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('debería establecer isLoading durante la carga', async () => {
      const store = createCardStore(mockRepository)
      const { result } = renderHook(() => store())

      act(() => {
        result.current.fetchCards('list-1')
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('debería mantener cards de otras listas al hacer fetch', async () => {
      await mockRepository.createCard({
        listId: 'list-1',
        title: 'Card A',
        status: 'todo',
        orderIndex: 0,
      })
      await mockRepository.createCard({
        listId: 'list-2',
        title: 'Card B',
        status: 'done',
        orderIndex: 0,
      })

      const store = createCardStore(mockRepository)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.fetchCards('list-1')
      })

      await act(async () => {
        await result.current.fetchCards('list-2')
      })

      expect(result.current.cards).toHaveLength(2)
      expect(result.current.cards.find((c) => c.title === 'Card A')).toBeDefined()
      expect(result.current.cards.find((c) => c.title === 'Card B')).toBeDefined()
    })
  })

  describe('addCard', () => {
    it('debería agregar una nueva card', async () => {
      const store = createCardStore(mockRepository)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.addCard({
          listId: 'list-1',
          title: 'New Card',
          status: 'todo',
          orderIndex: 0,
        })
      })

      expect(result.current.cards).toHaveLength(1)
      expect(result.current.cards[0].title).toBe('New Card')
    })
  })

  describe('updateCard', () => {
    it('debería actualizar los datos de una card', async () => {
      const card = await mockRepository.createCard({
        listId: 'list-1',
        title: 'Original',
        status: 'todo',
        orderIndex: 0,
      })

      const store = createCardStore(mockRepository)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.fetchCards('list-1')
      })

      await act(async () => {
        await result.current.updateCard(card.id, { title: 'Updated', status: 'in-progress' })
      })

      expect(result.current.cards[0].title).toBe('Updated')
      expect(result.current.cards[0].status).toBe('in-progress')
    })

    it('debería mover una card a otra lista', async () => {
      const card = await mockRepository.createCard({
        listId: 'list-1',
        title: 'Movable Card',
        status: 'todo',
        orderIndex: 0,
      })

      const store = createCardStore(mockRepository)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.fetchCards('list-1')
      })

      await act(async () => {
        await result.current.updateCard(card.id, { listId: 'list-2', orderIndex: 0 })
      })

      expect(result.current.cards[0].listId).toBe('list-2')
    })
  })

  describe('removeCard', () => {
    it('debería eliminar una card existente', async () => {
      const card = await mockRepository.createCard({
        listId: 'list-1',
        title: 'To Delete',
        status: 'todo',
        orderIndex: 0,
      })

      const store = createCardStore(mockRepository)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.fetchCards('list-1')
      })

      expect(result.current.cards).toHaveLength(1)

      await act(async () => {
        await result.current.removeCard(card.id)
      })

      expect(result.current.cards).toHaveLength(0)
    })
  })

  describe('manejo de errores', () => {
    it('debería capturar errores en fetchCards', async () => {
      const failingRepo: ICardRepository = {
        getCardsByListId: () => Promise.reject(new Error('DB error')),
        getCardById: () => Promise.reject(new Error('DB error')),
        createCard: () => Promise.reject(new Error('DB error')),
        updateCard: () => Promise.reject(new Error('DB error')),
        deleteCard: () => Promise.reject(new Error('DB error')),
      }

      const store = createCardStore(failingRepo)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.fetchCards('list-1')
      })

      expect(result.current.error).toBe('DB error')
      expect(result.current.isLoading).toBe(false)
    })
  })
})
