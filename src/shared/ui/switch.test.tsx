import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Switch } from './switch'

describe('Switch', () => {
  it('toggles state and calls onCheckedChange', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Switch onCheckedChange={handle} aria-label="notifications" />)
    const sw = screen.getByRole('switch', { name: 'notifications' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
    await user.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
    expect(handle).toHaveBeenCalledWith(true)
  })
})
