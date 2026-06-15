import { LogIn, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth'
import { ROUTES } from '@/shared/config'
import { notify } from '@/shared/lib'
import { Button, buttonVariants } from '@/shared/ui'

/**
 * Account controls for the dashboard headers: the signed-in user's name plus a
 * sign-out button, or a sign-in link when unauthenticated. Encapsulates the
 * auth-store wiring and sign-out handler so each shell doesn't repeat it.
 */
export function NavbarAuthActions() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleSignOut = () => {
    logout()
    notify.info(t('common.signedOut'))
    navigate(ROUTES.login)
  }

  if (!isAuthenticated) {
    return (
      <Link to={ROUTES.login} className={buttonVariants({ size: 'sm' })}>
        <LogIn className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">{t('common.signIn')}</span>
      </Link>
    )
  }

  return (
    <>
      {user?.name ? (
        <span className="hidden max-w-40 truncate text-sm font-medium text-zinc-600 lg:inline dark:text-zinc-400">
          {user.name}
        </span>
      ) : null}
      <Button variant="secondary" size="sm" onClick={handleSignOut}>
        <LogOut className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">{t('common.signOut')}</span>
      </Button>
    </>
  )
}
