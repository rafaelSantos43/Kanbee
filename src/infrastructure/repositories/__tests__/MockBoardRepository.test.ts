import { MockBoardRepository } from '../testing/MockBoardRepository'

describe('MockBoardRepository', () => {
  let repository: MockBoardRepository

  beforeEach(() => {
    repository = new MockBoardRepository()
  })

  describe('createBoard', () => {
    it('debería crear un nuevo tablero', async () => {
      const boardData = {
        title: 'Mi Proyecto',
        color: '#FF5733',
        userId: 'user-123',
        isFavorite: false,
      }

      const board = await repository.createBoard(boardData)

      expect(board).toMatchObject(boardData)
      expect(board.id).toBeDefined()
      expect(board.createdAt).toBeDefined()
    })

    it('debería asignar isFavorite por defecto como false', async () => {
      const board = await repository.createBoard({
        title: 'Test Board',
        userId: 'user-123',
      })

      expect(board.isFavorite).toBe(false)
    })
  })

  describe('getBoards', () => {
    it('debería retornar un array vacío al inicio', async () => {
      const boards = await repository.getBoards()
      expect(boards).toEqual([])
    })

    it('debería retornar todos los tableros creados', async () => {
      const board1 = await repository.createBoard({
        title: 'Board 1',
        userId: 'user-123',
      })
      const board2 = await repository.createBoard({
        title: 'Board 2',
        userId: 'user-123',
      })

      const boards = await repository.getBoards()

      expect(boards).toHaveLength(2)
      expect(boards).toContainEqual(board1)
      expect(boards).toContainEqual(board2)
    })
  })

  describe('getBoardById', () => {
    it('debería retornar un tablero por ID', async () => {
      const created = await repository.createBoard({
        title: 'Test Board',
        userId: 'user-123',
      })

      const found = await repository.getBoardById(created.id)

      expect(found).toEqual(created)
    })

    it('debería retornar null si el tablero no existe', async () => {
      const found = await repository.getBoardById('non-existent-id')

      expect(found).toBeNull()
    })
  })

  describe('updateBoard', () => {
    it('debería actualizar los datos de un tablero', async () => {
      const board = await repository.createBoard({
        title: 'Original Title',
        userId: 'user-123',
      })

      await repository.updateBoard(board.id, {
        title: 'Updated Title',
        color: '#00FF00',
      })

      const updated = await repository.getBoardById(board.id)

      expect(updated?.title).toBe('Updated Title')
      expect(updated?.color).toBe('#00FF00')
      expect(updated?.updatedAt).toBeDefined()
    })

    it('no debería hacer nada si el tablero no existe', async () => {
      // 1. Ejecución directa (sin envolver en expect si no quieres)
      await repository.updateBoard('id-fantasma', { title: 'Nuevo' })

      // 2. Verificación de seguridad: que el estado siga igual
      const boards = await repository.getBoards()
      expect(boards).toHaveLength(0) // Si empezó vacío, debe seguir vacío
    })
  })

  describe('deleteBoard', () => {
    it('debería eliminar un tablero', async () => {
      const board = await repository.createBoard({
        title: 'To Delete',
        userId: 'user-123',
      })

      await repository.deleteBoard(board.id)
      const found = await repository.getBoardById(board.id)

      expect(found).toBeNull()
    })

    it('debería permitir eliminar sin error si el tablero no existe', async () => {
      // Si esta línea lanza un error/rechazo, Bun marcará el test como fallido automáticamente
      await repository.deleteBoard('non-existent-id')
    })

    it('debería mantener otros tableros intactos', async () => {
      const board1 = await repository.createBoard({
        title: 'Board 1',
        userId: 'user-123',
      })
      const board2 = await repository.createBoard({
        title: 'Board 2',
        userId: 'user-123',
      })

      await repository.deleteBoard(board1.id)
      const boards = await repository.getBoards()

      expect(boards).toHaveLength(1)
      expect(boards[0]).toEqual(board2)
    })
  })
})
