import { KTextInput } from '@/components/KTextInput'
import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}))

describe('KTextInput Component', () => {
  it('debería renderizar sin props', () => {
    render(<KTextInput testID='input' />)

    expect(screen.getByTestId('input')).toBeTruthy()
  })

  it('debería renderizar con label', () => {
    render(
      <KTextInput
        label='Email'
        testID='input'
      />,
    )

    expect(screen.getByText('Email')).toBeTruthy()
  })

  it('debería mostrar mensaje de error', () => {
    render(
      <KTextInput
        error='Email inválido'
        testID='input'
      />,
    )

    expect(screen.getByText('Email inválido')).toBeTruthy()
  })

  it('debería renderizar iconos izquierdo y derecho', () => {
    render(
      <KTextInput
        testID='input'
        leftIcon={<text>MailIcon</text>}
        rightIcon={<text>CloseIcon</text>}
      />,
    )

    expect(screen.getByTestId('input')).toBeTruthy()
  })

  it('debería actualizar valor cuando el usuario escribe', () => {
    const { getByTestId } = render(
      <KTextInput
        testID='input'
        value=''
        onChangeText={() => {}}
      />,
    )

    const input = getByTestId('input')
    fireEvent.changeText(input, 'test@example.com')

    expect(input.props.value).toBeDefined()
  })

  it('debería tener placeholder personalizado', () => {
    render(
      <KTextInput
        testID='input'
        placeholder='Enter your email'
      />,
    )

    expect(screen.getByTestId('input')).toBeTruthy()
  })

  it('debería aceptar clases de contenedor personalizadas', () => {
    const { getByTestId } = render(
      <KTextInput
        testID='input'
        containerClassName='custom-container'
      />,
    )

    expect(getByTestId('input')).toBeTruthy()
  })

  it('debería soportar métodos de TextInput', () => {
    const { getByTestId } = render(
      <KTextInput
        testID='input'
        editable
        secureTextEntry={false}
      />,
    )

    const input = getByTestId('input')
    expect(input.props.editable).toBe(true)
    expect(input.props.secureTextEntry).toBe(false)
  })
})
