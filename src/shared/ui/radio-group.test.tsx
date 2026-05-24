import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { RadioGroup, RadioGroupItem } from './radio-group'

describe('RadioGroup', () => {
  it('selects one item at a time', async () => {
    const user = userEvent.setup()
    render(
      <RadioGroup>
        <RadioGroupItem name="size" value="sm" aria-label="sm" />
        <RadioGroupItem name="size" value="lg" aria-label="lg" />
      </RadioGroup>,
    )
    const sm = screen.getByLabelText('sm') as HTMLInputElement
    const lg = screen.getByLabelText('lg') as HTMLInputElement
    await user.click(lg)
    expect(lg.checked).toBe(true)
    expect(sm.checked).toBe(false)
  })
})
