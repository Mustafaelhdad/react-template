import { Activity, CircleDollarSign, Users } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui'

const stats = [
  { label: 'Active users', value: '1,248', icon: Users },
  { label: 'Revenue', value: '$24.8k', icon: CircleDollarSign },
  { label: 'Tasks complete', value: '86%', icon: Activity },
]

export function DashboardView() {
  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Protected route
          </p>
          <CardTitle className="text-2xl tracking-normal">Dashboard</CardTitle>
          <CardDescription className="max-w-2xl">
            This page is intentionally generic. Replace these starter metrics with the
            first real workflow in each project.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
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
