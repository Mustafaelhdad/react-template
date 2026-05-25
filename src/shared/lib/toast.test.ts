import { AxiosError, AxiosHeaders } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'

const successMock = vi.fn()
const errorMock = vi.fn()
const infoMock = vi.fn()
const promiseMock = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => successMock(...args),
    error: (...args: unknown[]) => errorMock(...args),
    info: (...args: unknown[]) => infoMock(...args),
    promise: (...args: unknown[]) => promiseMock(...args),
  },
}))

const { notify } = await import('./toast')

afterEach(() => {
  successMock.mockReset()
  errorMock.mockReset()
  infoMock.mockReset()
  promiseMock.mockReset()
})

describe('notify.error', () => {
  it('forwards a plain string straight through', () => {
    notify.error('Boom')
    expect(errorMock).toHaveBeenCalledWith('Boom', undefined)
  })

  it('runs an unknown error through parseApiError', () => {
    const axiosError = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 422,
        statusText: 'Unprocessable',
        data: { message: 'Email already taken' },
        headers: {},
        config: { headers: new AxiosHeaders() },
      },
    )

    notify.error(axiosError)

    expect(errorMock).toHaveBeenCalledWith('Email already taken', undefined)
  })

  it('handles bare Error instances', () => {
    notify.error(new Error('Network down'))
    expect(errorMock).toHaveBeenCalledWith('Network down', undefined)
  })
})

describe('notify.promise', () => {
  it('passes through string success/error', () => {
    const promise = Promise.resolve('ok')
    notify.promise(promise, {
      loading: 'Saving…',
      success: 'Saved',
      error: 'Could not save',
    })

    expect(promiseMock).toHaveBeenCalledTimes(1)
    const [forwardedPromise, messages] = promiseMock.mock.calls[0] as [
      Promise<string>,
      { loading: string; success: unknown; error: (cause: unknown) => string },
    ]
    expect(forwardedPromise).toBe(promise)
    expect(messages.loading).toBe('Saving…')
    expect(messages.success).toBe('Saved')

    // The fallback resolver runs unknown errors through parseApiError
    // before falling back to the caller-provided string.
    expect(messages.error(new Error('Real cause'))).toBe('Real cause')
    expect(messages.error(undefined)).toBe('Something went wrong. Please try again.')
  })

  it('keeps a caller-provided resolver function intact', () => {
    const resolver = vi.fn(() => 'custom')
    notify.promise(Promise.resolve(1), {
      loading: 'load',
      success: 'ok',
      error: resolver,
    })
    const [, messages] = promiseMock.mock.calls[0] as [
      unknown,
      { error: (cause: unknown) => string },
    ]
    expect(messages.error).toBe(resolver)
  })
})
