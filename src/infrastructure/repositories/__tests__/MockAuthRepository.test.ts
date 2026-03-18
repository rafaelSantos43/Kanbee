import { ROLES } from '@/constants/roles'
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
        email: 'mariadb@gmail.com',
        avartar:
          'https://m.media-amazon.com/images/M/MV5BZDYxY2I1OGMtN2Y4MS00ZmU1LTgyNDAtODA0MzAyYjI0N2Y2XkEyXkFqcGc@._V1_.jpg',
        role: ROLES[0],
      }

      await repository.register({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        avatar: userData.avartar,
        role: userData.role,
      })

      const session = await repository.login({ username: userData.username, password: userData.password })

      expect(session.username).toBe(userData.username)
      expect(session.id).toBeDefined()
    })
  })
})
