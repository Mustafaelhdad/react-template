import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('toggles on click', async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label="accept" />)
    const box = screen.getByLabelText('accept') as HTMLInputElement
    expect(box.checked).toBe(false)
    await user.click(box)
    expect(box.checked).toBe(true)
  })
})
