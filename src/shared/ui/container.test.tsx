import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Container } from './container'

describe('Container', () => {
  it('renders children inside a centered, padded wrapper', () => {
    render(
      <Container>
        <span>hello</span>
      </Container>,
    )
    const text = screen.getByText('hello')
    const wrapper = text.parentElement
    expect(wrapper).toHaveClass('mx-auto', 'w-full', 'max-w-screen-xl', 'px-4')
  })

  it('renders as a custom element when `as` is provided', () => {
    render(
      <Container as="section" data-testid="section">
        content
      </Container>,
    )
    expect(screen.getByTestId('section').tagName).toBe('SECTION')
  })

  it('merges custom className with defaults', () => {
    render(
      <Container className="py-12" data-testid="container">
        x
      </Container>,
    )
    const el = screen.getByTestId('container')
    expect(el).toHaveClass('mx-auto', 'py-12')
  })
})
