import { useMutation, type UseMutationOptions } from '@tanstack/react-query'

import { parseApiError } from '../api/parse-error'

import { notify } from './toast'

export type UseApiMutationOptions<TData, TVariables, TContext> = UseMutationOptions<
  TData,
  unknown,
  TVariables,
  TContext
> & {
  successMessage?: string
  errorMessage?: string
}

/**
 * Wraps `useMutation` with default toast feedback. Pass `successMessage` /
 * `errorMessage` to opt into automatic toasts. Errors flow through
 * `parseApiError` so component code only deals with a clean string.
 */
export function useApiMutation<TData = unknown, TVariables = void, TContext = unknown>(
  options: UseApiMutationOptions<TData, TVariables, TContext>,
) {
  const { successMessage, errorMessage, onSuccess, onError, ...rest } = options

  return useMutation<TData, unknown, TVariables, TContext>({
    ...rest,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (successMessage) {
        notify.success(successMessage)
      }
      return onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: (error, variables, onMutateResult, context) => {
      const parsed = parseApiError(error)
      notify.error(errorMessage ?? parsed.message)
      return onError?.(error, variables, onMutateResult, context)
    },
  })
}
