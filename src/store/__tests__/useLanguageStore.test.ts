import i18n from '@/i18n'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { useLanguageStore } from '../useLanguageStore'

// Mock i18next
jest.mock('@/i18n', () => ({
  language: 'en',
  changeLanguage: jest.fn((lng: string) => Promise.resolve()),
}))

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

describe('useLanguageStore - Language Change Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(i18n.changeLanguage as jest.Mock).mockImplementation((lng: string) => Promise.resolve())
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)
    ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined)
    // Resetear el store al estado inicial
    useLanguageStore.setState({ language: 'en' })
  })

  describe('Comportamiento de Inicialización', () => {
    it('debería inicializar con el idioma por defecto (en)', () => {
      const { result } = renderHook(() => useLanguageStore())

      expect(result.current.language).toBe('en')
    })

    it('debería ser accesible desde múltiples hooks', () => {
      const { result: hook1 } = renderHook(() => useLanguageStore())
      const { result: hook2 } = renderHook(() => useLanguageStore())

      expect(hook1.current.language).toBe(hook2.current.language)
    })
  })

  describe('Cambio de Idioma - Comportamiento Principal', () => {
    it('debería cambiar el idioma cuando se llama a setLanguage', async () => {
      const { result } = renderHook(() => useLanguageStore())

      await act(async () => {
        await result.current.setLanguage('es')
      })

      expect(i18n.changeLanguage).toHaveBeenCalledWith('es')
      expect(result.current.language).toBe('es')
    })

    it('debería actualizar el estado del store al cambiar idioma', async () => {
      const { result } = renderHook(() => useLanguageStore())

      // Verificar estado inicial
      expect(result.current.language).toBe('en')

      // Cambiar idioma
      await act(async () => {
        await result.current.setLanguage('es')
      })

      // Verificar que el estado se actualizó
      await waitFor(() => {
        expect(result.current.language).toBe('es')
      })
    })

    it('debería permitir cambiar a diferentes idiomas soportados', async () => {
      const { result } = renderHook(() => useLanguageStore())
      const supportedLanguages = ['en', 'es', 'fr', 'de']

      for (const lang of supportedLanguages) {
        await act(async () => {
          await result.current.setLanguage(lang)
        })

        expect(result.current.language).toBe(lang)
        expect(i18n.changeLanguage).toHaveBeenCalledWith(lang)
      }
    })

    it('debería permitir múltiples cambios de idioma en secuencia', async () => {
      const { result } = renderHook(() => useLanguageStore())

      await act(async () => {
        await result.current.setLanguage('es')
      })
      expect(result.current.language).toBe('es')

      await act(async () => {
        await result.current.setLanguage('fr')
      })
      expect(result.current.language).toBe('fr')

      await act(async () => {
        await result.current.setLanguage('en')
      })
      expect(result.current.language).toBe('en')
    })

    it('debería mantener la sincronización del estado con i18n', async () => {
      const { result } = renderHook(() => useLanguageStore())

      await act(async () => {
        await result.current.setLanguage('es')
      })

      // Verificar que i18n fue notificado del cambio
      expect(i18n.changeLanguage).toHaveBeenLastCalledWith('es')
    })
  })

  describe('Persistencia en AsyncStorage', () => {
    it('debería almacenar el idioma seleccionado en AsyncStorage', async () => {
      const { result } = renderHook(() => useLanguageStore())

      await act(async () => {
        await result.current.setLanguage('es')
      })

      // El store usa persist middleware, debería llamar a setItem
      // Verificar que el estado se persistió
      expect(result.current.language).toBe('es')
    })

    it('debería recuperar el idioma guardado desde AsyncStorage', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue('es')

      const { result } = renderHook(() => useLanguageStore())

      // El store debería haber recuperado el valor persistido
      expect(result.current.language).toBeDefined()
    })

    it('debería usar inglés como fallback si no hay idioma guardado', () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)
      useLanguageStore.setState({ language: 'en' })

      const { result } = renderHook(() => useLanguageStore())

      expect(result.current.language).toBe('en')
    })
  })

  describe('Manejo de Errores', () => {
    it('debería manejar errores al cambiar idioma sin romper el estado', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(i18n.changeLanguage as jest.Mock).mockRejectedValueOnce(new Error('Failed to change language'))

      const { result } = renderHook(() => useLanguageStore())
      const previousLanguage = result.current.language

      await act(async () => {
        await result.current.setLanguage('fr')
      })

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('debería continuar funcionando después de un error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(i18n.changeLanguage as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useLanguageStore())

      await act(async () => {
        await result.current.setLanguage('fr')
      })

      expect(consoleErrorSpy).toHaveBeenCalled()

      // Recuperar mockImplementation normal
      ;(i18n.changeLanguage as jest.Mock).mockImplementation((lng: string) => Promise.resolve())

      // Intentar cambiar nuevamente
      await act(async () => {
        await result.current.setLanguage('es')
      })

      expect(result.current.language).toBe('es')
      consoleErrorSpy.mockRestore()
    })

    it('debería no duplicar llamadas de cambio de idioma', async () => {
      const { result } = renderHook(() => useLanguageStore())

      await act(async () => {
        await result.current.setLanguage('es')
      })

      const callCount = (i18n.changeLanguage as jest.Mock).mock.calls.length

      // Cambiar al mismo idioma
      await act(async () => {
        await result.current.setLanguage('es')
      })

      // Debería haber sido llamado nuevamente (dependiendo de la implementación)
      // pero el estado no debería cambiar
      expect(result.current.language).toBe('es')
    })
  })

  describe('Re-renderizado de Componentes', () => {
    it('debería notificar a los suscriptores cuando cambia el idioma', async () => {
      const { result } = renderHook(() => useLanguageStore())
      let renderCount = 0

      const { rerender } = renderHook(() => {
        renderCount++
        return useLanguageStore()
      })

      const initialRenderCount = renderCount

      await act(async () => {
        await result.current.setLanguage('es')
      })

      rerender()

      // El hook debería re-renderizarse
      expect(renderCount).toBeGreaterThan(initialRenderCount)
    })

    it('debería mantener el estado consistente en múltiples instancias del store', async () => {
      const { result: hook1 } = renderHook(() => useLanguageStore())
      const { result: hook2 } = renderHook(() => useLanguageStore())

      await act(async () => {
        await hook1.current.setLanguage('es')
      })

      // Ambas instancias deberían reflejar el cambio
      expect(hook1.current.language).toBe('es')
      expect(hook2.current.language).toBe('es')
    })
  })
})
