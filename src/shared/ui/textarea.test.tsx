import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Textarea } from './textarea'

describe('Textarea', () => {
  it('accepts typed input', async () => {
    const user = userEvent.setup()
    render(<Textarea aria-label="bio" />)
    const field = screen.getByLabelText('bio')
    await user.type(field, 'hello world')
    expect(field).toHaveValue('hello world')
  })
})
