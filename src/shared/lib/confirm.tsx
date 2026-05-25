import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { ConfirmDialog } from '@/shared/ui/confirm-dialog'

export type ConfirmOptions = {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

type ProviderState = {
  options: ConfirmOptions
  open: boolean
} | null

type ConfirmProviderProps = {
  children: ReactNode
}

/**
 * Hosts a single ConfirmDialog instance and exposes a promise-based
 * `useConfirm()` hook. Wrap the app once (typically in `AppProviders`)
 * so any descendant can `const ok = await confirm({ title, body })`.
 *
 * Only one prompt is shown at a time — calling `confirm()` while a
 * prompt is open rejects the previous resolver with `false` and shows
 * the new prompt. Real apps rarely stack confirmations, and this
 * matches what a single Dialog instance can model.
 */
export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const [state, setState] = useState<ProviderState>(null)
  const resolverRef = useRef<((value: boolean) => void) | null>(null)

  const resolve = useCallback((value: boolean) => {
    const resolver = resolverRef.current
    resolverRef.current = null
    resolver?.(value)
  }, [])

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolvePromise) => {
        // Cancel any in-flight prompt before showing the new one.
        if (resolverRef.current) {
          resolverRef.current(false)
        }
        resolverRef.current = resolvePromise
        setState({ options, open: true })
      }),
    [],
  )

  const handleOpenChange = useCallback((open: boolean) => {
    setState((prev) => (prev ? { ...prev, open } : prev))
  }, [])

  const handleConfirm = useCallback(() => {
    resolve(true)
  }, [resolve])

  const handleCancel = useCallback(() => {
    resolve(false)
  }, [resolve])

  // `confirm` itself is stable; memoize the provider value so we don't
  // re-render the tree just because internal dialog state changed.
  const value = useMemo(() => confirm, [confirm])

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {state ? (
        <ConfirmDialog
          open={state.open}
          onOpenChange={handleOpenChange}
          title={state.options.title}
          description={state.options.description}
          confirmLabel={state.options.confirmLabel}
          cancelLabel={state.options.cancelLabel}
          destructive={state.options.destructive}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ) : null}
    </ConfirmContext.Provider>
  )
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error('useConfirm must be used inside <ConfirmProvider>')
  }
  return ctx
}
