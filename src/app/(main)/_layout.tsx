import { initializeDatabase } from '@/infrastructure/database/migrations'
import { Drawer } from 'expo-router/drawer'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function MainLayout() {
  const [isDbReady, setIsDbReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        await initializeDatabase()
      } finally {
        setIsDbReady(true)
      }
    })()
  }, [])

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator
          size='large'
          color='#6366f1'
        />
      </View>
    )
  }

  return (
    <Drawer
      screenOptions={{
        drawerType: 'front',
        drawerPosition: 'right',
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name='(board)'
        options={{
          drawerLabel: 'Home',
          title: 'KanBee',
        }}
      />
    </Drawer>
  )
}
