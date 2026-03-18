import i18n from '@/i18n'; // Tu configuración de i18next
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface LanguageState {
  language: string
  setLanguage: (lng: string) => Promise<void>
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: i18n.language || 'en',

      setLanguage: async (lng: string) => {
        try {
          await i18n.changeLanguage(lng)
          set({ language: lng })
        } catch (error) {
          console.error('Error changing language:', error)
        }
      },
    }),
    {
      name: 'kanbee-language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
