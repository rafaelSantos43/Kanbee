import { hashPassword } from '@/core/utils/hashPassword'
import { DrizzleAuthRepository } from '@/infrastructure/repositories/DrizzleAuthRepository'
import { useSessionStore } from '@/store/useSessionStore'
import { useState } from 'react'
import { Alert } from 'react-native'

const repository = new DrizzleAuthRepository()

export const useLogin = () => {
  const [loadingSession, setLoadingSession] = useState(false)
  const setSession = useSessionStore((state) => state.setSession)

  const submit = async (username: string, password: string) => {
    setLoadingSession(true)
    const hashedPassword = hashPassword(password)
    try {
      const resSession = await repository.login({ username, password: hashedPassword })
      const userData = {
        user: resSession,
        token: 'xxxxxxxxxx',
        authenticated: true,
        hasSeenTasksHint: true,
      }

      setSession(userData)
      Alert.alert('¡Éxito!', 'Sesión iniciada correctamente')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      Alert.alert('Error de autenticación', message)
    } finally {
      setLoadingSession(false)
    }
  }

  return { submit, loadingSession }
}
