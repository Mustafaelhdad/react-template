import { describe, expect, it } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { Button } from './button'

describe('Button', () => {
  it('renders an accessible button', () => {
    render(<Button>Save changes</Button>)

    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })

  it('uses type button by default', () => {
    render(<Button>Open menu</Button>)

    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
      'type',
      'button',
    )
  })
})
