import { List } from '../list'

describe('List Entity', () => {
  it('debería cumplir con la estructura de la interfaz List', () => {
    const listData: List = {
      id: 'list-1',
      boardId: 'board-1',
      title: 'To Do',
      orderIndex: 0,
      createdAt: Date.now(),
    }

    expect(listData.id).toBe('list-1')
    expect(listData.boardId).toBe('board-1')
    expect(listData.title).toBe('To Do')
    expect(listData.orderIndex).toBe(0)
  })

  it('debería mantener el orderIndex para ordenamiento', () => {
    const lists: List[] = [
      {
        id: 'list-1',
        boardId: 'board-1',
        title: 'Done',
        orderIndex: 2,
        createdAt: Date.now(),
      },
      {
        id: 'list-2',
        boardId: 'board-1',
        title: 'In Progress',
        orderIndex: 1,
        createdAt: Date.now(),
      },
      {
        id: 'list-3',
        boardId: 'board-1',
        title: 'To Do',
        orderIndex: 0,
        createdAt: Date.now(),
      },
    ]

    const sorted = lists.sort((a, b) => a.orderIndex - b.orderIndex)

    expect(sorted[0].title).toBe('To Do')
    expect(sorted[1].title).toBe('In Progress')
    expect(sorted[2].title).toBe('Done')
  })

  it('debería tener updatedAt opcional', () => {
    const listWithoutUpdatedAt: List = {
      id: 'list-1',
      boardId: 'board-1',
      title: 'To Do',
      orderIndex: 0,
      createdAt: Date.now(),
    }

    expect(listWithoutUpdatedAt.updatedAt).toBeUndefined()
  })

  it('debería permitir actualización de createdAt', () => {
    const now = Date.now()
    const list: List = {
      id: 'list-1',
      boardId: 'board-1',
      title: 'To Do',
      orderIndex: 0,
      createdAt: now,
      updatedAt: now + 1000,
    }

    expect(list.createdAt).toBe(now)
    expect(list.updatedAt).toBeGreaterThan(list.createdAt)
  })
})
