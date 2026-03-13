import { useColorScheme } from '@/hooks/use-color-scheme'
import '@/i18n'; // <--- ¡AÑADE ESTA LÍNEA! (Asegúrate que la ruta sea correcta)
import '@/styles/global.css'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useMemo } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      contentStyle: {
        backgroundColor: colorScheme === 'dark' ? '#262626' : '#f5f5f5',
      },
    }),
    [colorScheme],
  )

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

            {/* El grupo app/(auth)/ */}
            <Stack.Screen
              name='(auth)'
              options={{ headerShown: false }}
            />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
