import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders and animates', () => {
    render(<Skeleton className="h-4 w-20" />)
    const node = screen.getByTestId('skeleton')
    expect(node).toBeInTheDocument()
    expect(node.className).toMatch(/animate-pulse/)
  })
})
