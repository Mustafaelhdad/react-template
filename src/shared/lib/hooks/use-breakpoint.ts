import { useMediaQuery } from './use-media-query'

/**
 * Default Tailwind v4 breakpoints (in px). Keep aligned with the
 * project's `@theme` block if the defaults are ever customized.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS
export type BreakpointName = 'xs' | Breakpoint

const ORDER: BreakpointName[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

/**
 * Returns the largest Tailwind breakpoint currently active, or `'xs'`
 * if the viewport is below the smallest breakpoint.
 */
export function useBreakpoint(): BreakpointName {
  const sm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`)
  const md = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`)
  const lg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`)
  const xl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`)
  const xxl = useMediaQuery(`(min-width: ${BREAKPOINTS['2xl']}px)`)

  const matches = [true, sm, md, lg, xl, xxl]
  let active: BreakpointName = 'xs'
  for (let i = 0; i < matches.length; i += 1) {
    if (matches[i]) active = ORDER[i]
  }
  return active
}
