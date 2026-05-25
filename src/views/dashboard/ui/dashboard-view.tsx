import { Activity, CircleDollarSign, LogOut, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth'
import { ROUTES } from '@/shared/config'
import { notify, useConfirm } from '@/shared/lib'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui'

const stats = [
  { key: 'activeUsers', value: '1,248', icon: Users },
  { key: 'revenue', value: '$24.8k', icon: CircleDollarSign },
  { key: 'tasksComplete', value: '86%', icon: Activity },
] as const

export function DashboardView() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const confirm = useConfirm()
  const logout = useAuthStore((state) => state.logout)

  const handleSignOut = async () => {
    const ok = await confirm({
      title: t('dashboard.signOut.title'),
      description: t('dashboard.signOut.description'),
      confirmLabel: t('dashboard.signOut.confirm'),
      cancelLabel: t('common.cancel'),
      destructive: true,
    })
    if (!ok) return
    logout()
    notify.info(t('common.signedOut'))
    navigate(ROUTES.login)
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            {t('dashboard.protectedRoute')}
          </p>
          <CardTitle className="text-2xl tracking-normal sm:text-3xl">
            {t('dashboard.title')}
          </CardTitle>
          <CardDescription className="max-w-2xl">
            {t('dashboard.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <Button variant="danger" size="sm" onClick={handleSignOut}>
            <LogOut className="size-4" aria-hidden="true" />
            {t('common.signOut')}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.key}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t(`dashboard.stats.${stat.key}`)}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                    {stat.value}
                  </p>
                </div>
                <span className="grid size-10 place-items-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                  <stat.icon className="size-5" aria-hidden="true" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
