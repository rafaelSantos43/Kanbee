import { Session } from '@/core/entities/session'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SessionState extends Session {
  hydrated: boolean
}

interface SessionActions {
  setSession: (session: Session) => void
  setHasSeenTasksHint: () => void
  logOut: () => void
  setHydrated: () => void
}

const initialState: SessionState = {
  user: null,
  authenticated: false,
  hasSeenTasksHint: false,
  hydrated: false,
}

export const useSessionStore = create(
  persist<SessionState & SessionActions>(
    (set, get) => ({
      ...initialState,
      isAuthenticated: () => get().authenticated,
      setSession: (session) =>
        set({
          ...session,
          authenticated: true,
        }),

      setHasSeenTasksHint: () =>
        set({
          hasSeenTasksHint: true,
        }),

      logOut: () =>
        set({
          ...initialState,
        }),

      setHydrated: () =>
        set({
          hydrated: true,
        }),
    }),
    {
      name: process.env.EXPO_PUBLIC_LOCALSTORAGE_USER_KEY ?? 'user-session',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        // Esta función se ejecuta cuando el store empieza a cargar
        console.log('Iniciando hidratación...')

        return (state, error) => {
          if (error) {
            console.log('Error durante la hidratación:', error)
          } else {
            // Cuando termina con éxito, marcamos como hidratado
            state?.setHydrated()
            console.log('¡Hidratación completada!')
          }
        }
      },
    },
  ),
)
