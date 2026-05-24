import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from './App'

describe('App', () => {
  it('renders the home route', async () => {
    render(<App />)

    // Views are React.lazy now, so the heading shows up after the
    // chunk resolves — await it instead of querying synchronously.
    expect(
      await screen.findByRole('heading', { name: /reusable frontend template/i }),
    ).toBeInTheDocument()
  })
})
