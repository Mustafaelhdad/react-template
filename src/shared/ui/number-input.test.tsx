import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { NumberInput } from './number-input'

function ControlledNumberInput(
  props: Omit<Parameters<typeof NumberInput>[0], 'value' | 'onChange'>,
) {
  const [value, setValue] = useState('')
  return <NumberInput aria-label="amount" value={value} onChange={setValue} {...props} />
}

describe('NumberInput', () => {
  it('strips non-digit characters as the user types', async () => {
    const user = userEvent.setup()
    render(<ControlledNumberInput />)

    const input = screen.getByLabelText('amount') as HTMLInputElement
    await user.type(input, 'a1b2c3')

    expect(input.value).toBe('123')
  })

  it('converts Arabic-Indic digits to ASCII', async () => {
    const user = userEvent.setup()
    render(<ControlledNumberInput />)

    const input = screen.getByLabelText('amount') as HTMLInputElement
    await user.type(input, '١٢٣')

    expect(input.value).toBe('123')
  })

  it('increments and decrements via the control buttons', async () => {
    const user = userEvent.setup()
    render(<ControlledNumberInput controls min={0} max={5} />)

    const input = screen.getByLabelText('amount') as HTMLInputElement
    await user.click(screen.getByLabelText('Increase value'))
    await user.click(screen.getByLabelText('Increase value'))
    expect(input.value).toBe('2')

    await user.click(screen.getByLabelText('Decrease value'))
    expect(input.value).toBe('1')
  })

  it('disables the decrement button at the minimum value', () => {
    render(<ControlledNumberInput controls min={0} max={5} />)

    expect(screen.getByLabelText('Decrease value')).toBeDisabled()
  })
})
