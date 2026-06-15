import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'

import { parseApiError } from './parse-error'

function buildAxiosError(status: number, data: unknown, message = 'Request failed') {
  const config = { headers: new AxiosHeaders() }
  return new AxiosError(
    message,
    String(status),
    config,
    {},
    {
      status,
      statusText: '',
      headers: {},
      config,
      data,
    },
  )
}

describe('parseApiError', () => {
  it('returns the server message when present', () => {
    const error = buildAxiosError(400, { message: 'Email is required' })
    expect(parseApiError(error)).toEqual({
      message: 'Email is required',
      status: 400,
    })
  })

  it('localizes known axios messages when no server message exists', () => {
    const error = buildAxiosError(500, null, 'Network Error')
    expect(parseApiError(error)).toEqual({
      message: 'Unable to reach the server. Check your connection and try again.',
      status: 500,
    })
  })

  it('extracts the message from a thrown Error', () => {
    expect(parseApiError(new Error('Boom'))).toEqual({ message: 'Boom' })
  })

  it('returns a default message for unknown shapes', () => {
    expect(parseApiError(undefined).message).toMatch(/something went wrong/i)
    expect(parseApiError({}).message).toMatch(/something went wrong/i)
  })

  it('uses the string itself when given a string error', () => {
    expect(parseApiError('Specific message')).toEqual({
      message: 'Specific message',
    })
  })
})
