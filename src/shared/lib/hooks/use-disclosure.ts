import { useCallback, useState } from 'react'

export type Disclosure = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  setOpen: (next: boolean) => void
}

/**
 * Manages a binary open/closed state with stable handlers. Useful for
 * dialogs, drawers, menus, and any other show/hide UI.
 */
export function useDisclosure(initial = false): Disclosure {
  const [isOpen, setIsOpen] = useState(initial)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const setOpen = useCallback((next: boolean) => setIsOpen(next), [])

  return { isOpen, open, close, toggle, setOpen }
}
