import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Spinner } from './spinner'

describe('Spinner', () => {
  it('renders a labeled status role', () => {
    render(<Spinner label="Saving" />)
    const status = screen.getByRole('status', { name: 'Saving' })
    expect(status).toBeInTheDocument()
  })
})
