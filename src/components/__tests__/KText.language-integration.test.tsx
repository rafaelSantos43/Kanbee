import { useLanguageStore } from '@/store/useLanguageStore'
import { act, render, screen } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

// Mock i18n
jest.mock('@/i18n', () => ({
  default: {
    changeLanguage: jest.fn(async (lang: string) => lang),
    language: 'en',
  },
}))

// Test component that changes language through store and component should re-render
const LanguageTestComponent = () => {
  const { language, setLanguage } = useLanguageStore()
  const [localKey, setLocalKey] = React.useState('hello')

  const handleChangeLanguage = async (lang: string) => {
    await setLanguage(lang)
  }

  return <Text testID='language-display'>Language: {language}</Text>
}

const LanguageSwitcherWithRender = () => {
  const { language, setLanguage } = useLanguageStore()

  const handleChangeLanguage = (lang: string) => {
    setLanguage(lang)
  }

  return (
    <>
      <Text testID='current-language'>{language}</Text>
      <Text
        testID='change-en'
        onPress={() => handleChangeLanguage('en')}
      >
        English
      </Text>
      <Text
        testID='change-es'
        onPress={() => handleChangeLanguage('es')}
      >
        Spanish
      </Text>
    </>
  )
}

describe('KText Language Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useLanguageStore.setState({ language: 'en' })
  })

  it('debería mostrar el idioma actual en el componente', () => {
    render(<LanguageTestComponent />)
    const display = screen.getByTestId('language-display')
    expect(display.children[1]).toBe('en')
  })

  it('debería cambiar el idioma cuando se actualiza el store', async () => {
    render(<LanguageTestComponent />)
    let display = screen.getByTestId('language-display')
    expect(display.children[1]).toBe('en')

    await act(async () => {
      useLanguageStore.setState({ language: 'es' })
    })

    display = screen.getByTestId('language-display')
    expect(display.children[1]).toBe('es')
  })

  it('debería soportar cambios secuenciales de idioma', async () => {
    render(<LanguageTestComponent />)
    const display = screen.getByTestId('language-display')

    const languages = ['en', 'es', 'fr', 'de', 'en']
    for (const lang of languages) {
      await act(async () => {
        useLanguageStore.setState({ language: lang })
      })
      expect(display.children[1]).toBe(lang)
    }
  })

  it('debería re-renderizar el componente cuando el idioma cambia a través del store', async () => {
    const { rerender } = render(<LanguageTestComponent />)
    let display = screen.getByTestId('language-display')
    expect(display.children[1]).toBe('en')

    await act(async () => {
      useLanguageStore.setState({ language: 'es' })
    })
    rerender(<LanguageTestComponent />)

    display = screen.getByTestId('language-display')
    expect(display.children[1]).toBe('es')
  })

  it('debería mantener el idioma persistido después del cambio', async () => {
    render(<LanguageTestComponent />)

    await act(async () => {
      useLanguageStore.setState({ language: 'es' })
    })

    const storeLanguage = useLanguageStore.getState().language
    expect(storeLanguage).toBe('es')

    const display = screen.getByTestId('language-display')
    expect(display.children[1]).toBe('es')
  })

  it('debería sincronizar múltiples instancias del componente al cambiar idioma', async () => {
    render(
      <>
        <LanguageTestComponent />
        <LanguageTestComponent />
      </>,
    )

    const displays = screen.getAllByTestId('language-display')
    expect(displays[0].children[1]).toBe('en')
    expect(displays[1].children[1]).toBe('en')

    await act(async () => {
      useLanguageStore.setState({ language: 'es' })
    })

    expect(displays[0].children[1]).toBe('es')
    expect(displays[1].children[1]).toBe('es')
  })

  it('debería actualizar el idioma en el store de manera inmediata', () => {
    render(<LanguageSwitcherWithRender />)
    const currentLanguage = screen.getByTestId('current-language')
    expect(currentLanguage.children[0]).toBe('en')

    const storeState = useLanguageStore.getState()
    expect(storeState.language).toBe('en')
  })

  it('debería permitir cambios de idioma múltiples sin pérdida de estado', async () => {
    render(<LanguageSwitcherWithRender />)

    const languages = ['es', 'en', 'fr', 'es', 'en']
    for (const lang of languages) {
      await act(async () => {
        useLanguageStore.setState({ language: lang })
      })
      const currentLanguage = screen.getByTestId('current-language')
      expect(currentLanguage.children[0]).toBe(lang)
    }
  })
})
