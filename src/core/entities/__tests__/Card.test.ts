import { Card } from '../card'

describe('Card Entity', () => {
  it('debería cumplir con la estructura de la interfaz Card', () => {
    const cardData: Card = {
      id: 'card-1',
      listId: 'list-1',
      title: 'Implementar login',
      description: 'Agregar autenticación',
      status: 'in-progress',
      orderIndex: 0,
      createdAt: Date.now(),
    }

    expect(cardData.id).toBe('card-1')
    expect(cardData.listId).toBe('list-1')
    expect(cardData.title).toBe('Implementar login')
    expect(cardData.status).toBe('in-progress')
  })

  it('debería permitir estados válidos', () => {
    const validStatuses: Card['status'][] = ['todo', 'in-progress', 'done', 'blocked']

    validStatuses.forEach((status) => {
      const card: Card = {
        id: 'card-1',
        listId: 'list-1',
        title: 'Task',
        status,
        orderIndex: 0,
        createdAt: Date.now(),
      }

      expect(card.status).toBe(status)
    })
  })

  it('debería tener descripción opcional', () => {
    const cardWithoutDescription: Card = {
      id: 'card-1',
      listId: 'list-1',
      title: 'Task',
      status: 'todo',
      orderIndex: 0,
      createdAt: Date.now(),
    }

    expect(cardWithoutDescription.description).toBeUndefined()
  })

  it('debería tener updatedAt opcional', () => {
    const cardWithoutUpdatedAt: Card = {
      id: 'card-1',
      listId: 'list-1',
      title: 'Task',
      status: 'todo',
      orderIndex: 0,
      createdAt: Date.now(),
    }

    expect(cardWithoutUpdatedAt.updatedAt).toBeUndefined()
  })

  it('debería mantener el orderIndex para ordenamiento', () => {
    const cards: Card[] = [
      {
        id: 'card-1',
        listId: 'list-1',
        title: 'First',
        status: 'todo',
        orderIndex: 0,
        createdAt: Date.now(),
      },
      {
        id: 'card-2',
        listId: 'list-1',
        title: 'Second',
        status: 'todo',
        orderIndex: 1,
        createdAt: Date.now(),
      },
      {
        id: 'card-3',
        listId: 'list-1',
        title: 'Third',
        status: 'todo',
        orderIndex: 2,
        createdAt: Date.now(),
      },
    ]

    const sorted = cards.sort((a, b) => a.orderIndex - b.orderIndex)

    expect(sorted[0].title).toBe('First')
    expect(sorted[1].title).toBe('Second')
    expect(sorted[2].title).toBe('Third')
  })
})
