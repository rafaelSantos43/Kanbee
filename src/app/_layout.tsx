import { useColorScheme } from '@/hooks/use-color-scheme'
import '@/i18n'
import { useSessionStore } from '@/store/useSessionStore'
import '@/styles/global.css'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const { authenticated, hydrated } = useSessionStore()
  const segments = useSegments()
  const router = useRouter()
  const navigationState = useRootNavigationState()

  useEffect(() => {
    if (!hydrated || !navigationState?.key) return

    const inAuthGroup = segments[0] === '(auth)'
    const timeout = setTimeout(() => {
      if (!authenticated && !inAuthGroup) {
        router.replace('/(auth)')
      } else if (authenticated && inAuthGroup) {
        router.replace('/(main)/(board)/')
      }
    }, 1)
    return () => clearTimeout(timeout)
  }, [router, authenticated, hydrated, segments, navigationState?.key])

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      contentStyle: {
        backgroundColor: colorScheme === 'dark' ? '#262626' : '#f5f5f5',
      },
    }),
    [colorScheme],
  )

  if (!hydrated) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', backgroundColor: colorScheme === 'dark' ? '#262626' : '#f5f5f5' }}
      >
        <ActivityIndicator
          size='large'
          color='#6366f1'
        />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar
            style={colorScheme === 'dark' ? 'light' : 'dark'}
            translucent
            backgroundColor='transparent'
          />
          <Stack screenOptions={screenOptions}>
            <Stack.Screen
              name='index'
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='(auth)'
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='(main)'
              options={{ headerShown: false }}
            />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
