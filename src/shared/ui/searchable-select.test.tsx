import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { MultiSelect, SearchableSelect, type SelectOption } from './searchable-select'

const options: SelectOption[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
]

function ControlledSearchableSelect() {
  const [value, setValue] = useState<SelectOption | null>(null)
  return (
    <SearchableSelect
      aria-label="letter"
      options={options}
      value={value}
      onChange={(option) => setValue(option)}
    />
  )
}

function ControlledMultiSelect() {
  const [value, setValue] = useState<readonly SelectOption[]>([])
  return (
    <MultiSelect
      aria-label="letters"
      options={options}
      value={value}
      onChange={(selected) => setValue(selected)}
    />
  )
}

describe('SearchableSelect', () => {
  it('selects an option from the menu', async () => {
    const user = userEvent.setup()
    render(<ControlledSearchableSelect />)

    const input = screen.getByLabelText('letter')
    await user.click(input)
    await user.click(screen.getByText('Beta'))

    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('marks the control as invalid', () => {
    render(<SearchableSelect aria-label="letter" options={options} isInvalid />)

    expect(screen.getByLabelText('letter')).toHaveAttribute('aria-invalid', 'true')
  })
})

describe('MultiSelect', () => {
  it('selects multiple options', async () => {
    const user = userEvent.setup()
    render(<ControlledMultiSelect />)

    const input = screen.getByLabelText('letters')
    await user.click(input)
    await user.click(screen.getByText('Alpha'))
    await user.click(input)
    await user.click(screen.getByText('Gamma'))

    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })
})
