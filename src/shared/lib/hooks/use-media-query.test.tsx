import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useMediaQuery } from './use-media-query'

type Listener = (event: MediaQueryListEvent) => void

function installMatchMedia(initialMatches: boolean) {
  const listeners = new Set<Listener>()
  const list = {
    matches: initialMatches,
    media: '',
    onchange: null,
    addEventListener: (_: string, l: Listener) => listeners.add(l),
    removeEventListener: (_: string, l: Listener) => listeners.delete(l),
    dispatchEvent: () => true,
    addListener: () => undefined,
    removeListener: () => undefined,
  }

  const matchMedia = vi.fn().mockReturnValue(list)
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: matchMedia,
  })

  return {
    fire(matches: boolean) {
      list.matches = matches
      listeners.forEach((l) => l({ matches } as MediaQueryListEvent))
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

describe('useMediaQuery', () => {
  it('returns the initial match state', () => {
    installMatchMedia(true)
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(true)
  })

  it('updates when the media query changes', () => {
    const { fire } = installMatchMedia(false)
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    expect(result.current).toBe(false)
    act(() => fire(true))
    expect(result.current).toBe(true)
  })
})
