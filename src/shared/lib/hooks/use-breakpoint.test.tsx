import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { BREAKPOINTS, useBreakpoint } from './use-breakpoint'

function installViewport(width: number) {
  let currentWidth = width
  const lists = new Map<string, ReturnType<typeof createList>>()

  function createList(query: string) {
    const match = /\(min-width:\s*(\d+)px\)/.exec(query)
    const min = match ? Number(match[1]) : 0
    return {
      matches: currentWidth >= min,
      media: query,
      onchange: null,
      listeners: new Set<(event: MediaQueryListEvent) => void>(),
      addEventListener(_: string, listener: (event: MediaQueryListEvent) => void) {
        this.listeners.add(listener)
      },
      removeEventListener(_: string, listener: (event: MediaQueryListEvent) => void) {
        this.listeners.delete(listener)
      },
      dispatchEvent: () => true,
      addListener: () => undefined,
      removeListener: () => undefined,
    }
  }

  const matchMedia = vi.fn((query: string) => {
    const list = lists.get(query) ?? createList(query)
    lists.set(query, list)
    return list
  })

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: matchMedia,
  })

  return {
    resize(nextWidth: number) {
      currentWidth = nextWidth
      lists.forEach((list) => {
        const match = /\(min-width:\s*(\d+)px\)/.exec(list.media)
        const min = match ? Number(match[1]) : 0
        const nextMatches = currentWidth >= min
        if (list.matches === nextMatches) return
        list.matches = nextMatches
        list.listeners.forEach((listener) =>
          listener({ matches: nextMatches, media: list.media } as MediaQueryListEvent),
        )
      })
    },
  }
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
  it('returns "base" below the sm breakpoint', () => {
    installViewport(BREAKPOINTS.sm - 1)
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('base')
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

  it('updates as the viewport crosses breakpoints', () => {
    const viewport = installViewport(BREAKPOINTS.sm - 1)
    const { result } = renderHook(() => useBreakpoint())

    expect(result.current).toBe('base')

    act(() => viewport.resize(BREAKPOINTS.lg))
    expect(result.current).toBe('lg')

    act(() => viewport.resize(BREAKPOINTS.md - 1))
    expect(result.current).toBe('sm')
  })
})
