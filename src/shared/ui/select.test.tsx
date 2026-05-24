import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Select } from './select'

describe('Select', () => {
  it('updates the selected option', async () => {
    const user = userEvent.setup()
    render(
      <Select defaultValue="a" aria-label="letter">
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>,
    )
    const select = screen.getByLabelText('letter') as HTMLSelectElement
    expect(select.value).toBe('a')
    await user.selectOptions(select, 'b')
    expect(select.value).toBe('b')
  })
})
