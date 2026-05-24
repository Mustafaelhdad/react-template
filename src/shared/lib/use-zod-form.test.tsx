import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { useZodForm } from './use-zod-form'

const schema = z.object({
  email: z.email({ message: 'bad email' }),
})

describe('useZodForm', () => {
  it('reports validation errors from the schema', async () => {
    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { email: 'not-an-email' } }),
    )

    let isValid = true
    await act(async () => {
      isValid = await result.current.trigger()
    })

    expect(isValid).toBe(false)
    expect(result.current.getFieldState('email').error?.message).toBe('bad email')
  })

  it('passes validation for valid input', async () => {
    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { email: 'user@example.com' } }),
    )

    let isValid = false
    await act(async () => {
      isValid = await result.current.trigger()
    })

    expect(isValid).toBe(true)
    expect(result.current.getFieldState('email').error).toBeUndefined()
  })
})
