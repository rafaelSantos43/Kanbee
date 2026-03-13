import { MockAuthRepository } from '../testing/MockAuthRepository'

describe('MockAuthRepository', () => {
  let repository: MockAuthRepository

  beforeEach(() => {
    repository = new MockAuthRepository()
  })

  describe('session', () => {
    it('debería iniciar sesión correctamente con un usuario existente', async () => {
      const userData = {
        username: 'mariadb',
        password: 'asd123',
      }

      await repository.register(userData.username, userData.password)
      const session = await repository.login(userData.username, userData.password)

      expect(session.username).toBe(userData.username)
      expect(session.id).toBeDefined()
    })
  })
})
