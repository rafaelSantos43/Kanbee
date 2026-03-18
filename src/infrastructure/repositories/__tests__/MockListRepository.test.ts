import { MockListRepository } from '../testing/MockListRepository'

describe('MockListRepository', () => {
  let repository: MockListRepository

  beforeEach(() => {
    repository = new MockListRepository()
  })

  describe('createList', () => {
    it('deberia crear una nueva lista', async () => {
      const listData = {
        boardId: '12345',
        title: 'Mi primera Lista',
        orderIndex: 1,
      }

      const list = await repository.createList(listData)

      expect(list).toMatchObject(listData)
      expect(list.id).toBeDefined()
      expect(list.createdAt).toBeDefined()
    })
  })

  describe('getListsByBoardId', () => {
    it('debería retornar un array vacío al inicio', async () => {
      const lists = await repository.getListsByBoardId('12345')
      expect(lists).toEqual([])
    })

    it('debería retornar todos las listas creadas', async () => {
      const list1 = await repository.createList({
        title: 'list1',
        boardId: '12345',
        orderIndex: 1,
      })

      const list2 = await repository.createList({
        title: 'list2',
        boardId: '12345',
        orderIndex: 2,
      })

      const lists = await repository.getListsByBoardId('12345')

      expect(lists).toHaveLength(2)
      expect(lists).toContainEqual(list1)
      expect(lists).toContainEqual(list2)
    })
  })

  describe('getListById', () => {
    it('debería retornar una lista por ID', async () => {
      const created = await repository.createList({
        title: 'Test List',
        boardId: '12345',
        orderIndex: 1,
      })

      const found = await repository.getListById(created.id)

      expect(found).toEqual(created)
    })

    it('debería retornar null si la lista no existe', async () => {
      const found = await repository.getListById('non-existent-id')
      expect(found).toBeNull()
    })
  })

  describe('updateList', () => {
    it('debería actualizar los datos de una lista', async () => {
      const list = await repository.createList({
        title: 'Original Title',
        boardId: '12345',
        orderIndex: 1,
      })

      await repository.updateList(list.id, {
        title: 'Updated Title',
        orderIndex: 2,
      })

      const update = await repository.getListById(list.id)

      expect(update?.title).toBe('Updated Title')
      expect(update?.orderIndex).toBe(2)
      expect(update?.updatedAt).toBeDefined()
    })

    it('no debería hacer nada si el tablero no existe', async () => {
      await repository.updateList('id-fantasma', { title: 'Nuevo' })

      const lists = await repository.getListsByBoardId('12345')
      expect(lists).toHaveLength(0)
    })
  })

  describe('deleteList', () => {
    it('debería eliminar un tablero', async () => {
      const list = await repository.createList({
        title: 'To Delete',
        boardId: '12345',
        orderIndex: 1,
      })

      await repository.deleteList(list.id)
      const found = await repository.getListById(list.id)

      expect(found).toBeNull()
    })

    it('debería permitir eliminar sin error si la lista no existe', async () => {
      await repository.deleteList('non-existent-id')
    })

    it('debería mantener otras listas intactas', async () => {
      const list1 = await repository.createList({
        title: 'list1',
        boardId: '12345',
        orderIndex: 1,
      })

      const list2 = await repository.createList({
        title: 'list2',
        boardId: '12345',
        orderIndex: 2,
      })

      await repository.deleteList(list1.id)
      const lists = await repository.getListsByBoardId('12345')

      expect(lists).toHaveLength(1)
      expect(lists[0]).toEqual(list2)
    })
  })
})
