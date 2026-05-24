import { useEffect, useRef, type RefObject } from 'react'

type AnyEvent = MouseEvent | TouchEvent

/**
 * Invokes `handler` when a pointer event fires outside the element
 * referenced by `ref`. Listens to both mouse and touch events. Pass
 * `enabled = false` to temporarily disable.
 */
export function useOnClickOutside<TElement extends HTMLElement = HTMLElement>(
  ref: RefObject<TElement | null>,
  handler: (event: AnyEvent) => void,
  enabled = true,
): void {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (!enabled) return
    if (typeof document === 'undefined') return

    function onPointer(event: AnyEvent) {
      const el = ref.current
      if (!el) return
      const target = event.target as Node | null
      if (target && el.contains(target)) return
      handlerRef.current(event)
    }

    document.addEventListener('mousedown', onPointer)
    document.addEventListener('touchstart', onPointer)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('touchstart', onPointer)
    }
  }, [ref, enabled])
}
