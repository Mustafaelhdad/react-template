import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls the window back to the top whenever the pathname changes.
 * Mount once near the root (inside MainLayout, above `<Outlet />`).
 *
 * Hash navigations are intentionally ignored — if the URL points at
 * `#section`, the browser's default anchor behavior should win.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
