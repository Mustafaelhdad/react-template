import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider, useTheme } from './theme'

const matchMediaSpies = {
  matches: false,
  listeners: new Set<(event: MediaQueryListEvent) => void>(),
}

function installMatchMedia() {
  matchMediaSpies.matches = false
  matchMediaSpies.listeners = new Set()
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matchMediaSpies.matches,
      media: query,
      onchange: null,
      addEventListener: (_event: 'change', cb: (event: MediaQueryListEvent) => void) =>
        matchMediaSpies.listeners.add(cb),
      removeEventListener: (_event: 'change', cb: (event: MediaQueryListEvent) => void) =>
        matchMediaSpies.listeners.delete(cb),
      dispatchEvent: () => true,
      addListener: () => undefined,
      removeListener: () => undefined,
    })),
  })
}

function fireSystemChange(matches: boolean) {
  matchMediaSpies.matches = matches
  matchMediaSpies.listeners.forEach((cb) =>
    cb({ matches } as unknown as MediaQueryListEvent),
  )
}

function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.classList.remove('dark')
  installMatchMedia()
})

afterEach(() => {
  document.documentElement.classList.remove('dark')
})

describe('ThemeProvider + useTheme', () => {
  it('defaults to system and resolves against matchMedia', () => {
    matchMediaSpies.matches = true
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('system')
    expect(result.current.resolvedTheme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('persists explicit selections and toggles the html class', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => result.current.setTheme('dark'))
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('react-template:theme')).toBe('"dark"')

    act(() => result.current.setTheme('light'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('rehydrates from localStorage on mount', () => {
    window.localStorage.setItem('react-template:theme', '"dark"')
    renderHook(() => useTheme(), { wrapper })
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('follows OS changes while theme is "system"', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => result.current.setTheme('system'))

    act(() => fireSystemChange(true))
    expect(result.current.resolvedTheme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    act(() => fireSystemChange(false))
    expect(result.current.resolvedTheme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('throws when used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => renderHook(() => useTheme())).toThrow(/useTheme must be used inside/)
    spy.mockRestore()
  })
})

function Probe() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <div>
      <p data-testid="resolved">{resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>Go dark</button>
    </div>
  )
}

describe('ThemeProvider rendering', () => {
  it('lets a child toggle the theme', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('resolved').textContent).toBe('light')
    await user.click(screen.getByRole('button', { name: 'Go dark' }))
    expect(screen.getByTestId('resolved').textContent).toBe('dark')
  })
})
