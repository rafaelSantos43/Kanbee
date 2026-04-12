import { IListRepository } from '@/core/interfaces/ListRepository'
import { MockListRepository } from '@/infrastructure/repositories/testing/MockListRepository'
import { act, renderHook, waitFor } from '@testing-library/react-native'

jest.mock('@/infrastructure/repositories/DrizzleListRepository', () => ({
  DrizzleListRepository: jest.fn(),
}))

import { createListStore } from '../useListStore'

describe('useListStore', () => {
  let mockRepository: IListRepository

  beforeEach(() => {
    mockRepository = new MockListRepository()
  })

  it('debería inicializar con estado vacío', () => {
    const store = createListStore(mockRepository)
    const { result } = renderHook(() => store())

    expect(result.current.lists).toEqual([])
    expect(result.current.isLoading).toEqual(false)
    expect(result.current.error).toBeNull()
    expect(result.current.searchQuery).toBe('')
  })

  describe('fetchLists', () => {
    it('debería cargar listas desde el repositorio', async () => {
      await mockRepository.createList({
        title: 'list1',
        boardId: '12345',
        orderIndex: 1,
      })

      await mockRepository.createList({
        title: 'list2',
        boardId: '12345',
        orderIndex: 2,
      })

      const store = createListStore(mockRepository)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.fetchLists('12345')
      })

      expect(result.current.lists).toHaveLength(2)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('debería establecer isLoading durante la carga', async () => {
      const store = createListStore(mockRepository)
      const { result } = renderHook(() => store())

      act(() => {
        result.current.fetchLists('12345')
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('addList', () => {
    it('debería agregar una nueva lista', async () => {
      const store = createListStore(mockRepository)
      const { result } = renderHook(() => store())

      const newList = {
        title: 'list2',
        boardId: '12345',
        orderIndex: 1,
      }

      await act(async () => {
        await result.current.addList(newList)
        await result.current.fetchLists('12345')
      })

      expect(result.current.lists).toHaveLength(1)
      expect(result.current.lists[0].title).toBe('list2')
    })
  })

  describe('updateList', () => {
    it('debería actualizar los datos de una lista', async () => {
      const list = await mockRepository.createList({
        title: 'Original',
        boardId: '12345',
        orderIndex: 1,
      })
      const store = createListStore(mockRepository)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.fetchLists('12345')
      })

      await act(async () => {
        await result.current.updateList(list.id, { title: 'new title', orderIndex: 2 })
      })

      expect(result.current.lists).toHaveLength(1)
      expect(result.current.lists[0].title).toBe('new title')
      expect(result.current.lists[0].orderIndex).toBe(2)
    })
  })

  describe('removeList', () => {
    it('debería eliminar una lista existente', async () => {
      const list = await mockRepository.createList({
        title: 'new list',
        boardId: '12345',
        orderIndex: 1,
      })

      const store = createListStore(mockRepository)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.fetchLists('12345')
      })

      expect(result.current.lists).toHaveLength(1)

      await act(async () => {
        await result.current.removeList(list.id)
        await result.current.fetchLists('12345')
      })

      expect(result.current.lists).toHaveLength(0)
    })
  })

  describe('setSearchQuery', () => {
    it('debería actualizar la query de búsqueda', () => {
      const store = createListStore(mockRepository)
      const { result } = renderHook(() => store())

      act(() => {
        result.current.setSearchQuery('search term')
      })

      expect(result.current.searchQuery).toBe('search term')
    })

    it('debería permitir limpieza de búsqueda', () => {
      const store = createListStore(mockRepository)
      const { result } = renderHook(() => store())

      act(() => {
        result.current.setSearchQuery('search')
        result.current.setSearchQuery('')
      })

      expect(result.current.searchQuery).toBe('')
    })
  })
})
