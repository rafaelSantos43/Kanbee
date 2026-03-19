import { MockCardRepository } from '../testing/MockCardRepository'

describe('MockCardRepository', () => {
  let repository: MockCardRepository

  beforeEach(() => {
    repository = new MockCardRepository()
  })

  describe('createCard', () => {
    it('debería crear una nueva card', async () => {
      const cardData = {
        listId: 'list-1',
        title: 'Mi primera Card',
        status: 'todo' as const,
        orderIndex: 0,
      }

      const card = await repository.createCard(cardData)

      expect(card).toMatchObject(cardData)
      expect(card.id).toBeDefined()
      expect(card.createdAt).toBeDefined()
    })

    it('debería incluir la descripción si se proporciona', async () => {
      const card = await repository.createCard({
        listId: 'list-1',
        title: 'Card con desc',
        description: 'Detalle importante',
        status: 'todo',
        orderIndex: 0,
      })

      expect(card.description).toBe('Detalle importante')
    })
  })

  describe('getCardsByListId', () => {
    it('debería retornar un array vacío al inicio', async () => {
      const cards = await repository.getCardsByListId('list-1')
      expect(cards).toEqual([])
    })

    it('debería retornar cards filtradas por listId', async () => {
      await repository.createCard({ listId: 'list-1', title: 'Card A', status: 'todo', orderIndex: 0 })
      await repository.createCard({ listId: 'list-2', title: 'Card B', status: 'todo', orderIndex: 0 })
      await repository.createCard({ listId: 'list-1', title: 'Card C', status: 'done', orderIndex: 1 })

      const cards = await repository.getCardsByListId('list-1')

      expect(cards).toHaveLength(2)
      expect(cards[0].title).toBe('Card A')
      expect(cards[1].title).toBe('Card C')
    })

    it('debería retornar cards ordenadas por orderIndex', async () => {
      await repository.createCard({ listId: 'list-1', title: 'Third', status: 'todo', orderIndex: 2 })
      await repository.createCard({ listId: 'list-1', title: 'First', status: 'todo', orderIndex: 0 })
      await repository.createCard({ listId: 'list-1', title: 'Second', status: 'todo', orderIndex: 1 })

      const cards = await repository.getCardsByListId('list-1')

      expect(cards[0].title).toBe('First')
      expect(cards[1].title).toBe('Second')
      expect(cards[2].title).toBe('Third')
    })
  })

  describe('getCardById', () => {
    it('debería retornar una card por ID', async () => {
      const created = await repository.createCard({
        listId: 'list-1',
        title: 'Test Card',
        status: 'todo',
        orderIndex: 0,
      })

      const found = await repository.getCardById(created.id)

      expect(found).toEqual(created)
    })

    it('debería retornar null si la card no existe', async () => {
      const found = await repository.getCardById('non-existent-id')

      expect(found).toBeNull()
    })
  })

  describe('updateCard', () => {
    it('debería actualizar el título de una card', async () => {
      const card = await repository.createCard({
        listId: 'list-1',
        title: 'Original',
        status: 'todo',
        orderIndex: 0,
      })

      await repository.updateCard(card.id, { title: 'Updated' })

      const updated = await repository.getCardById(card.id)

      expect(updated?.title).toBe('Updated')
      expect(updated?.updatedAt).toBeDefined()
    })

    it('debería actualizar el status de una card', async () => {
      const card = await repository.createCard({
        listId: 'list-1',
        title: 'Task',
        status: 'todo',
        orderIndex: 0,
      })

      await repository.updateCard(card.id, { status: 'in-progress' })

      const updated = await repository.getCardById(card.id)

      expect(updated?.status).toBe('in-progress')
    })

    it('debería mover una card a otra lista', async () => {
      const card = await repository.createCard({
        listId: 'list-1',
        title: 'Movable',
        status: 'todo',
        orderIndex: 0,
      })

      await repository.updateCard(card.id, { listId: 'list-2', orderIndex: 3 })

      const updated = await repository.getCardById(card.id)

      expect(updated?.listId).toBe('list-2')
      expect(updated?.orderIndex).toBe(3)
    })

    it('debería actualizar la descripción', async () => {
      const card = await repository.createCard({
        listId: 'list-1',
        title: 'Card',
        status: 'todo',
        orderIndex: 0,
      })

      await repository.updateCard(card.id, { description: 'Nueva descripción' })

      const updated = await repository.getCardById(card.id)

      expect(updated?.description).toBe('Nueva descripción')
    })

    it('no debería hacer nada si la card no existe', async () => {
      await repository.updateCard('id-fantasma', { title: 'Nuevo' })

      const cards = await repository.getCardsByListId('list-1')
      expect(cards).toHaveLength(0)
    })
  })

  describe('deleteCard', () => {
    it('debería eliminar una card', async () => {
      const card = await repository.createCard({
        listId: 'list-1',
        title: 'To Delete',
        status: 'todo',
        orderIndex: 0,
      })

      await repository.deleteCard(card.id)
      const found = await repository.getCardById(card.id)

      expect(found).toBeNull()
    })

    it('debería permitir eliminar sin error si la card no existe', async () => {
      await repository.deleteCard('non-existent-id')
    })

    it('debería mantener otras cards intactas', async () => {
      const card1 = await repository.createCard({
        listId: 'list-1',
        title: 'Card 1',
        status: 'todo',
        orderIndex: 0,
      })
      const card2 = await repository.createCard({
        listId: 'list-1',
        title: 'Card 2',
        status: 'todo',
        orderIndex: 1,
      })

      await repository.deleteCard(card1.id)
      const cards = await repository.getCardsByListId('list-1')

      expect(cards).toHaveLength(1)
      expect(cards[0]).toEqual(card2)
    })
  })
})
