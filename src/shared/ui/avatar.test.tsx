import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Avatar } from './avatar'

describe('Avatar', () => {
  it('renders the fallback when no src is provided', () => {
    render(<Avatar fallback="MM" />)
    expect(screen.getByText('MM')).toBeInTheDocument()
  })

  it('renders the image when src is provided', () => {
    render(<Avatar src="/me.jpg" alt="me" fallback="MM" />)
    expect(screen.getByAltText('me')).toBeInTheDocument()
  })
})
