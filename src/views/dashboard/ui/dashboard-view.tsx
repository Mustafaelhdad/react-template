import { Activity, CircleDollarSign, Users } from 'lucide-react'

const stats = [
  { label: 'Active users', value: '1,248', icon: Users },
  { label: 'Revenue', value: '$24.8k', icon: CircleDollarSign },
  { label: 'Tasks complete', value: '86%', icon: Activity },
]

export function DashboardView() {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-emerald-700">Protected route</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-zinc-950">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          This page is intentionally generic. Replace these starter metrics with the first
          real workflow in each project.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-950">{stat.value}</p>
              </div>
              <span className="grid size-10 place-items-center rounded-md bg-amber-50 text-amber-700">
                <stat.icon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
