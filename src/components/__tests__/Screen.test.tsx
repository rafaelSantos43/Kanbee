import { Screen } from '@/components/Screen'
import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
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

describe('Screen Component', () => {
  it('debería renderizar componente hijo', () => {
    render(
      <Screen>
        <Text>Child Content</Text>
      </Screen>,
    )

    expect(screen.getByText('Child Content')).toBeTruthy()
  })

  it('debería renderizar título', () => {
    render(
      <Screen title='Test Title'>
        <Text>Content</Text>
      </Screen>,
    )

    expect(screen.getByText('Test Title')).toBeTruthy()
  })

  it('debería renderizar subtítulo', () => {
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

  it('debería renderizar con iconos personalizados', () => {
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

  it('debería renderizar con botón back por defecto', () => {
    render(
      <Screen enableBack>
        <Text>Content</Text>
      </Screen>,
    )

    expect(screen.getByText('←')).toBeTruthy()
  })

  it('debería no renderizar botón back cuando goBack es false', () => {
    render(
      <Screen
        testID='screen1'
        enableBack={false}
      >
        <Text>Content</Text>
      </Screen>,
    )

    expect(screen.queryByText('←')).toBeFalsy()
  })

  it('debería renderizar sin errores con diferentes configuraciones', () => {
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
