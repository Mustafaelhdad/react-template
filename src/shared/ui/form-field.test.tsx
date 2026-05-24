import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { useZodForm } from '@/shared/lib'

import { FormField } from './form-field'
import { Textarea } from './textarea'

const schema = z.object({
  email: z.email({ message: 'Enter a valid email' }),
  bio: z.string().min(1, 'Required'),
})

function Harness() {
  const form = useZodForm(schema, {
    defaultValues: { email: '', bio: '' },
  })

  return (
    <form
      onSubmit={form.handleSubmit(() => {
        /* noop */
      })}
    >
      <FormField control={form.control} name="email" label="Email" />
      <FormField control={form.control} name="bio" label="Bio">
        {({ field, id }) => <Textarea id={id} {...field} />}
      </FormField>
      <button type="submit">Submit</button>
    </form>
  )
}

describe('FormField', () => {
  it('renders the label and surfaces validation errors', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Bio')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument()
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('writes typed input back to the form', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    const email = screen.getByLabelText('Email') as HTMLInputElement
    await user.type(email, 'me@example.com')
    expect(email.value).toBe('me@example.com')
  })
})
