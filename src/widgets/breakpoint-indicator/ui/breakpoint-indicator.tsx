import { useBreakpoint } from '@/shared/lib'

/**
 * Development-only viewport helper. Remove this from `App.tsx` if a
 * project prefers a completely clean local canvas.
 */
export function BreakpointIndicator() {
  const breakpoint = useBreakpoint()

  if (!import.meta.env.DEV) return null

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-3 left-3 z-[60] rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase text-zinc-700 shadow-sm backdrop-blur rtl:left-auto rtl:right-3 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-300"
    >
      {breakpoint}
    </div>
  )
}
