import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import { Card, CardContent, CardHeader, CardTitle, buttonVariants } from '@/shared/ui'

const capabilityKeys = ['routing', 'query', 'protected', 'folders'] as const

export function HomeView() {
  const { t } = useTranslation()

  return (
    <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          {t('home.tag')}
        </div>
        <div className="space-y-4">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl dark:text-zinc-50">
            {t('home.title')}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {t('home.description')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={ROUTES.dashboard} className={buttonVariants()}>
            {t('home.openDashboard')}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
          <Link to={ROUTES.login} className={buttonVariants({ variant: 'secondary' })}>
            {t('home.viewLogin')}
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('home.shellTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {capabilityKeys.map((key) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-md border border-zinc-200 px-3 py-3 dark:border-zinc-800"
            >
              <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t(`home.capabilities.${key}`)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
