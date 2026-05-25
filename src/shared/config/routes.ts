export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  uiKit: '/ui-kit',
  sessionExpired: '/session-expired',
  error: '/error',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

/**
 * Maps URL segments to i18n keys used by the breadcrumbs widget. Add an
 * entry for each route segment that should appear in breadcrumbs.
 */
export const ROUTE_LABELS: Record<string, string> = {
  '': 'nav.home',
  dashboard: 'nav.dashboard',
  'ui-kit': 'sidebar.uiKit',
  login: 'common.signIn',
  'session-expired': 'sessionExpired.title',
  error: 'error.title',
}

export const ROUTE_FALLBACK_LABELS: Record<string, string> = {
  '': 'Home',
  dashboard: 'Dashboard',
  'ui-kit': 'UI Kit',
  login: 'Sign in',
  'session-expired': 'Session expired',
  error: 'Error',
}
