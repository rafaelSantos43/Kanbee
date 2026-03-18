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

const initialState: Omit<SessionState, 'hydrated'> = {
  user: null,
  authenticated: false,
  hasSeenTasksHint: false,
}

export const useSessionStore = create(
  persist<SessionState & SessionActions>(
    (set, get) => ({
      ...initialState,
      hydrated: false,
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
          hydrated: true,
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
        return (state, error) => {
          if (!error) state?.setHydrated()
        }
      },
    },
  ),
)
