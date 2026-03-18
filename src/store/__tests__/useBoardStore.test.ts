import type { IBoardRepository } from '@/core/interfaces/IBoardRepository'
import { MockBoardRepository } from '@/infrastructure/repositories/testing/MockBoardRepository'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { createBoardStore } from '../useBoardStore'

describe('useBoardStore', () => {
  let mockRepository: IBoardRepository

  beforeEach(() => {
    mockRepository = new MockBoardRepository()
  })

  it('debería inicializar con estado vacío', () => {
    const store = createBoardStore(mockRepository)
    const { result } = renderHook(() => store())

    expect(result.current.boards).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.searchQuery).toBe('')
  })

  describe('fetchBoards', () => {
    it('debería cargar tableros desde el repositorio', async () => {
      // Crear tableros en el repositorio
      await mockRepository.createBoard({
        title: 'Test Board 1',
        userId: 'user-123',
      })
      await mockRepository.createBoard({
        title: 'Test Board 2',
        userId: 'user-123',
      })

      const store = createBoardStore(mockRepository)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.fetchBoards('user-123')
      })

      expect(result.current.boards).toHaveLength(2)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('debería establecer isLoading durante la carga', async () => {
      const store = createBoardStore(mockRepository)
      const { result } = renderHook(() => store())

      act(() => {
        result.current.fetchBoards('user-123')
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('addBoard', () => {
    it('debería agregar un nuevo tablero', async () => {
      const store = createBoardStore(mockRepository)
      const { result } = renderHook(() => store())

      const newBoard = {
        title: 'New Board',
        userId: 'user-123',
        isFavorite: false,
      }

      await act(async () => {
        await result.current.addBoard(newBoard)
        await result.current.fetchBoards('user-123')
      })

      expect(result.current.boards).toHaveLength(1)
      expect(result.current.boards[0].title).toBe('New Board')
    })
  })

  describe('removeBoard', () => {
    it('debería eliminar un tablero existente', async () => {
      const board = await mockRepository.createBoard({
        title: 'Test Board',
        userId: 'user-123',
      })

      const store = createBoardStore(mockRepository)
      const { result } = renderHook(() => store())

      await act(async () => {
        await result.current.fetchBoards('user-123')
      })

      expect(result.current.boards).toHaveLength(1)

      await act(async () => {
        await result.current.removeBoard(board.id)
        await result.current.fetchBoards('user-123')
      })

      expect(result.current.boards).toHaveLength(0)
    })
  })

  describe('setSearchQuery', () => {
    it('debería actualizar la query de búsqueda', () => {
      const store = createBoardStore(mockRepository)
      const { result } = renderHook(() => store())

      act(() => {
        result.current.setSearchQuery('search term')
      })

      expect(result.current.searchQuery).toBe('search term')
    })

    it('debería permitir limpieza de búsqueda', () => {
      const store = createBoardStore(mockRepository)
      const { result } = renderHook(() => store())

      act(() => {
        result.current.setSearchQuery('search')
        result.current.setSearchQuery('')
      })

      expect(result.current.searchQuery).toBe('')
    })
  })
})
