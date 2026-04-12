import { User } from '@/core/entities'
import { hashPassword } from '@/core/utils/hashPassword'
import { DrizzleAuthRepository } from '@/infrastructure/repositories/DrizzleAuthRepository'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

export const useRegister = () => {
  const repository = new DrizzleAuthRepository()
  const [loadingRegister, setLoadingRegister] = useState(false)

  const submit = async ({ userData, password }: { userData: User; password: string }) => {
    const { username, email, role, avatar } = userData
    if (!username.trim() || !password.trim() || !email.trim() || !role.trim()) {
      Alert.alert('Atencion', 'El usuario y la contrasena son obligatorios.')
      return
    }

    setLoadingRegister(true)
    const hashedPassword = hashPassword(password)

    try {
      const responseData = await repository.register({
        username,
        email,
        password: hashedPassword,
        role,
        avatar: avatar ?? null,
      })

      if (responseData.id) {
        Alert.alert('Exito', 'Registro completado correctamente', [
          { text: 'OK', onPress: () => router.replace('/(auth)') },
        ])
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Error de Registro', 'no se pudo registrar el usuario')
    } finally {
      setLoadingRegister(false)
    }
  }

  return {
    submit,
    loadingRegister,
  }
}
