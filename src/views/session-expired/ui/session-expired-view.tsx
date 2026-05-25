import { LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib'
import { Card, CardContent, buttonVariants } from '@/shared/ui'

export function SessionExpiredView() {
  const { t } = useTranslation()

  return (
    <Card className="mx-auto w-full max-w-lg text-center">
      <CardContent className="p-4 sm:p-6">
        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
          {t('sessionExpired.tag')}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-zinc-950 sm:text-3xl dark:text-zinc-50">
          {t('sessionExpired.title')}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {t('sessionExpired.description')}
        </p>
        <Link
          to={ROUTES.login}
          className={cn(buttonVariants(), 'mt-6 inline-flex items-center gap-2')}
        >
          <LogIn className="size-4" aria-hidden="true" />
          {t('sessionExpired.signInAgain')}
        </Link>
      </CardContent>
    </Card>
  )
}
