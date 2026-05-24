import { BREAKPOINTS } from './use-breakpoint'
import { useMediaQuery } from './use-media-query'

/**
 * Returns `true` when the viewport is narrower than Tailwind's `md`
 * breakpoint. Thin sugar over `useMediaQuery`.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`)
}
