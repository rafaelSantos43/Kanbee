// src/app/index.tsx
import { useSessionStore } from '@/store/useSessionStore'
import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
//import { useAuthStore } from '@/store/useAuthStore'; // Asumiendo que crearás este store

export default function Index() {
  const { authenticated, hydrated } = useSessionStore()
  console.log('🚀 ~ Index ~ authenticated:', authenticated, hydrated)

  // 1. Mientras verificamos si hay una sesión en el almacenamiento (AsyncStorage/SQLite)
  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator
          size='large'
          color='#6366f1'
        />
      </View>
    )
  }

  // 2. Si NO hay sesión, lo mandamos al login (o al onboarding)
  if (!authenticated) {
    return <Redirect href='/(auth)' />
  }

  // 3. Si hay sesión, lo mandamos al Home
  return <Redirect href='/(main)/(board)/' />
}
