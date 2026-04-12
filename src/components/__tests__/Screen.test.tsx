import { Screen } from '@/components/Screen'
import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
}))

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('lucide-react-native', () => ({
  ChevronLeft: () => {
    const { Text: MockText } = require('react-native')
    return <MockText>back-icon</MockText>
  },
}))

describe('Screen Component', () => {
  it('deberia renderizar componente hijo', () => {
    render(
      <Screen>
        <Text>Child Content</Text>
      </Screen>,
    )

    expect(screen.getByText('Child Content')).toBeTruthy()
  })

  it('deberia renderizar titulo', () => {
    render(
      <Screen title='Test Title'>
        <Text>Content</Text>
      </Screen>,
    )

    expect(screen.getByText('Test Title')).toBeTruthy()
  })

  it('deberia renderizar subtitulo', () => {
    render(
      <Screen
        title='Title'
        subtitle='Subtitle'
      >
        <Text>Content</Text>
      </Screen>,
    )

    expect(screen.getByText('Subtitle')).toBeTruthy()
  })

  it('deberia renderizar con iconos personalizados', () => {
    render(
      <Screen
        leftIcon={<Text>LeftIcon</Text>}
        rightIcon={<Text>RightIcon</Text>}
      >
        <Text>Content</Text>
      </Screen>,
    )

    expect(screen.getByText('LeftIcon')).toBeTruthy()
    expect(screen.getByText('RightIcon')).toBeTruthy()
  })

  it('deberia renderizar con boton back por defecto', () => {
    render(
      <Screen enableBack>
        <Text>Content</Text>
      </Screen>,
    )

    expect(screen.getByText('back-icon')).toBeTruthy()
  })

  it('deberia no renderizar boton back cuando enableBack es false', () => {
    render(
      <Screen
        testID='screen1'
        enableBack={false}
      >
        <Text>Content</Text>
      </Screen>,
    )

    expect(screen.queryByText('back-icon')).toBeNull()
  })

  it('deberia renderizar sin errores con diferentes configuraciones', () => {
    const { getByTestId: getByTestId1 } = render(
      <Screen
        testID='screen1'
        scroll={false}
      >
        <Text testID='content1'>Content</Text>
      </Screen>,
    )

    expect(getByTestId1('content1')).toBeTruthy()
  })
})
