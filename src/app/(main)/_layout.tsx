import { KText } from '@/components/KText'
import { initializeDatabase } from '@/infrastructure/database/migrations'
import { useSessionStore } from '@/store/useSessionStore'
import { Drawer } from 'expo-router/drawer'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'

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
      drawerContent={DrawerContent}
    />
  )
}

const DrawerContent = () => {
  const logOut = useSessionStore((state) => state.logOut)
  const user = useSessionStore((state) => state.user)
  return (
    <View className='flex-1  top-20 items-center px-4'>
      <Pressable
        onPress={logOut}
        className=' w-full items-center p-4 bg-slate-500'
      >
        <KText label={user?.username} />
        <KText label={user?.email} />
        <KText label='LOGOUT' />
      </Pressable>
    </View>
  )
}
