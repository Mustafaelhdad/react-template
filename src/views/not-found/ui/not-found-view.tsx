import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib'
import { Card, CardContent, buttonVariants } from '@/shared/ui'

export function NotFoundView() {
  const { t } = useTranslation()

  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {t('notFound.code')}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
          {t('notFound.title')}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {t('notFound.description')}
        </p>
        <Link to={ROUTES.home} className={cn(buttonVariants(), 'mt-6')}>
          {t('notFound.backHome')}
        </Link>
      </CardContent>
    </Card>
  )
}
