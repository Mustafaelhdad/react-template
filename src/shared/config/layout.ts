import { ROUTES, type AppRoute } from './routes'

export type LayoutPreset = 'marketing' | 'dashboard-sidebar' | 'dashboard-topnav'

/**
 * Compile-time layout preset. The template init script rewrites this value
 * when a project is created with `--layout=...`.
 */
export const LAYOUT: LayoutPreset = 'dashboard-sidebar'

export type NavIconKey = 'home' | 'dashboard' | 'uiKit'

export type RouteNavItem = {
  key: string
  to: AppRoute
  labelKey: string
  fallbackLabel: string
  icon: NavIconKey
  end?: boolean
}

export const MARKETING_NAV_ITEMS = [
  {
    key: 'home',
    to: ROUTES.home,
    labelKey: 'nav.home',
    fallbackLabel: 'Home',
    icon: 'home',
    end: true,
  },
  {
    key: 'uiKit',
    to: ROUTES.uiKit,
    labelKey: 'sidebar.uiKit',
    fallbackLabel: 'UI Kit',
    icon: 'uiKit',
    end: true,
  },
] satisfies RouteNavItem[]

export const DASHBOARD_NAV_ITEMS = [
  {
    key: 'dashboard',
    to: ROUTES.dashboard,
    labelKey: 'sidebar.dashboard',
    fallbackLabel: 'Overview',
    icon: 'dashboard',
    end: true,
  },
  {
    key: 'uiKit',
    to: ROUTES.uiKit,
    labelKey: 'sidebar.uiKit',
    fallbackLabel: 'UI Kit',
    icon: 'uiKit',
    end: true,
  },
] satisfies RouteNavItem[]
