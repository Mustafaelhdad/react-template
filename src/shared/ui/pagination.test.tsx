import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Pagination } from './pagination'

function installMaxWidth(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => ({
      matches: query === '(max-width: 639px)' ? matches : false,
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

describe('Pagination', () => {
  it('calls onPageChange when a numbered button is clicked', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Pagination page={1} pageCount={5} onPageChange={handle} />)
    await user.click(screen.getByRole('button', { name: '3' }))
    expect(handle).toHaveBeenCalledWith(3)
  })

  it('disables Previous on the first page', () => {
    render(<Pagination page={1} pageCount={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  })

  it('returns null with one page or fewer', () => {
    const { container } = render(
      <Pagination page={1} pageCount={1} onPageChange={() => {}} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('reduces siblings below the small breakpoint', () => {
    installMaxWidth(true)
    render(<Pagination page={5} pageCount={10} onPageChange={() => {}} />)

    expect(screen.queryByRole('button', { name: '4' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
  })
})
