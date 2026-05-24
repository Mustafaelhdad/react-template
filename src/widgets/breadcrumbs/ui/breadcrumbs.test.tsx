import { describe, expect, it } from 'vitest'

import { renderWithProviders, screen } from '@/test/test-utils'

import { Breadcrumbs } from './breadcrumbs'

describe('Breadcrumbs', () => {
  it('renders nothing on the home route', () => {
    const { container } = renderWithProviders(<Breadcrumbs />, { route: '/' })
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the trail for a single-level route', () => {
    renderWithProviders(<Breadcrumbs />, { route: '/dashboard' })
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    const current = screen.getByText('Dashboard')
    expect(current).toHaveAttribute('aria-current', 'page')
  })

  it('falls back to a humanized segment when the path is unknown', () => {
    renderWithProviders(<Breadcrumbs />, { route: '/some-unknown-route' })
    expect(screen.getByText('Some Unknown Route')).toBeInTheDocument()
  })
})
