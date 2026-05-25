import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

function installPointer(pointerFine: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => ({
      matches: pointerFine && query === '(hover: hover) and (pointer: fine)',
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

describe('Tooltip', () => {
  it('renders trigger and is wired to a content node', () => {
    installPointer(true)
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Helpful info</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(screen.getByText('Hover me')).toBeInTheDocument()
    // open prop forces the portal content to render. Radix mirrors content
    // into a screen-reader-only node, so we expect more than one match.
    expect(screen.getAllByText('Helpful info').length).toBeGreaterThan(0)
  })

  it('does not render content on coarse touch pointers by default', () => {
    installPointer(false)
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Tap me</TooltipTrigger>
          <TooltipContent>Touch tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(screen.getByText('Tap me')).toBeInTheDocument()
    expect(screen.queryByText('Touch tooltip')).not.toBeInTheDocument()
  })
})
