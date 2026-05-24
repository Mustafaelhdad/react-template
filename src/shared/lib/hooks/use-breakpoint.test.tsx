import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { BREAKPOINTS, useBreakpoint } from './use-breakpoint'

function installViewport(width: number) {
  const matchMedia = vi.fn((query: string) => {
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
  })

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: matchMedia,
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

describe('useBreakpoint', () => {
  it('returns "xs" below the sm breakpoint', () => {
    installViewport(BREAKPOINTS.sm - 1)
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('xs')
  })

  it('returns "md" between md and lg', () => {
    installViewport(BREAKPOINTS.md + 10)
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('md')
  })

  it('returns "2xl" at the largest breakpoint', () => {
    installViewport(BREAKPOINTS['2xl'] + 100)
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('2xl')
  })
})
