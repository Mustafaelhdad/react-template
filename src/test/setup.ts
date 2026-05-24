import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom does not implement `window.matchMedia`. The ThemeProvider and
// any responsive hooks rely on it, so install a benign default for every
// test. Individual tests can override this with their own spies.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => true,
      addListener: () => undefined,
      removeListener: () => undefined,
    })),
  })
}
