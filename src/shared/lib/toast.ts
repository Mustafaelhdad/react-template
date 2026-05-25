import { toast, type ExternalToast } from 'sonner'

import { parseApiError } from '../api/parse-error'

type NotifyOptions = ExternalToast

type PromiseMessages<T> = {
  loading: string
  success: string | ((data: T) => string)
  /**
   * Static error string, or a function called with the rejection.
   * The function receives the raw error so it can pull a status code
   * or message — most callers want `parseApiError`, which is what the
   * string fallback uses under the hood.
   */
  error: string | ((error: unknown) => string)
}

function resolveErrorMessage(value: unknown): string {
  if (typeof value === 'string') return value
  return parseApiError(value).message
}

export const notify = {
  success(message: string, options?: NotifyOptions) {
    toast.success(message, options)
  },
  /**
   * Accepts either a string message or an unknown error. When an error
   * is passed, it's funnelled through `parseApiError` so callers can
   * write `notify.error(e)` instead of `notify.error(parseApiError(e).message)`.
   */
  error(messageOrError: unknown, options?: NotifyOptions) {
    toast.error(resolveErrorMessage(messageOrError), options)
  },
  info(message: string, options?: NotifyOptions) {
    toast.info(message, options)
  },
  /**
   * Thin wrapper over `toast.promise` that funnels a rejection through
   * `parseApiError` when the caller passes a plain string for `error`.
   * Pass a function if you need access to the raw cause.
   */
  promise<T>(promise: Promise<T>, messages: PromiseMessages<T>) {
    const errorMessage = messages.error
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error:
        typeof errorMessage === 'function'
          ? errorMessage
          : (cause) => resolveErrorMessage(cause) || errorMessage,
    })
  },
}
