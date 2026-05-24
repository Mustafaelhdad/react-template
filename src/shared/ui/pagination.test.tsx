import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Pagination } from './pagination'

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
})
