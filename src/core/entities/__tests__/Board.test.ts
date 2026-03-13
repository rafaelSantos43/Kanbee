import { Board } from '../board'

describe('Board Entity', () => {
  it('debería cumplir con la estructura de la interfaz Board', () => {
    const boardData: Board = {
      id: '1',
      title: 'Kanbee Proyect',
      color: '#FFD24D',
      userId: 'user-123',
      isFavorite: false,
      createdAt: Date.now(),
    }

    expect(boardData.title).toBe('Kanbee Proyect')
    expect(boardData.color).toBe('#FFD24D')
    expect(boardData.isFavorite).toBe(false)
  })
})
