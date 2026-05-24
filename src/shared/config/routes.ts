export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  uiKit: '/ui-kit',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
