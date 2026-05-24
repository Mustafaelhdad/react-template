import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No results" description="Try a different query" />)
    expect(screen.getByText('No results')).toBeInTheDocument()
    expect(screen.getByText('Try a different query')).toBeInTheDocument()
  })
})
