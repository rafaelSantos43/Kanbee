import { KText } from '@/components/KText'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('KText Component', () => {
  it('debería renderizar con label', () => {
    render(<KText label='Test Label' />)

    expect(screen.getByText('Test Label')).toBeTruthy()
  })

  it('debería renderizar con traducción i18n', () => {
    render(<KText tx='common.hello' />)

    expect(screen.getByText('common.hello')).toBeTruthy()
  })

  it('debería renderizar label y tx cuando ambos están presentes', () => {
    const { queryByText } = render(
      <KText
        label='Label'
        tx='common.hello'
      />,
    )

    // El componente renderiza ambos cuando están presentes
    expect(queryByText(/Label/)).toBeTruthy()
    expect(queryByText(/common.hello/)).toBeTruthy()
  })

  it('debería aplicar variantes de estilos', () => {
    const { getByTestId } = render(
      <>
        <KText
          testID='h1'
          label='Heading 1'
          variant='h1'
        />
        <KText
          testID='h2'
          label='Heading 2'
          variant='h2'
        />
        <KText
          testID='body'
          label='Body'
          variant='body'
        />
        <KText
          testID='caption'
          label='Caption'
          variant='caption'
        />
      </>,
    )

    expect(getByTestId('h1')).toBeTruthy()
    expect(getByTestId('h2')).toBeTruthy()
    expect(getByTestId('body')).toBeTruthy()
    expect(getByTestId('caption')).toBeTruthy()
  })

  it('debería usar variante body por defecto', () => {
    render(<KText label='Default' />)

    expect(screen.getByText('Default')).toBeTruthy()
  })

  it('debería aceptar props adicionales de Text', () => {
    const { getByTestId } = render(
      <KText
        label='Test'
        testID='custom-text'
        numberOfLines={1}
      />,
    )

    expect(getByTestId('custom-text')).toBeTruthy()
  })
})
