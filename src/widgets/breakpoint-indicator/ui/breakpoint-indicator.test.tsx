import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { BREAKPOINTS } from '@/shared/lib'

import { BreakpointIndicator } from './breakpoint-indicator'

function installViewport(width: number) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => {
      const match = /\(min-width:\s*(\d+)px\)/.exec(query)
      const min = match ? Number(match[1]) : 0
      return {
        matches: width >= min,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
        addListener: () => undefined,
        removeListener: () => undefined,
      }
    }),
  })
}

let originalMatchMedia: typeof window.matchMedia

beforeEach(() => {
  originalMatchMedia = window.matchMedia
})

afterEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: originalMatchMedia,
  })
})

describe('BreakpointIndicator', () => {
  it('renders the current breakpoint in development', () => {
    installViewport(BREAKPOINTS.xl)
    render(<BreakpointIndicator />)
    expect(screen.getByText('xl')).toBeInTheDocument()
  })
})
