import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from './badge'

describe('Badge', () => {
  it('renders content and applies the variant', () => {
    render(<Badge variant="success">Active</Badge>)
    const badge = screen.getByText('Active')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toMatch(/bg-emerald-600/)
  })
})
