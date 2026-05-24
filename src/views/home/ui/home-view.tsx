import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/config'

const capabilities = [
  'Routing shell',
  'Query provider',
  'Protected dashboard',
  'Feature-sliced folders',
]

export function HomeView() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
          React + Vite starter
        </div>
        <div className="space-y-4">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
            A reusable frontend template for project starts.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600">
            Use this shell as the generic starting point for apps that need routing,
            providers, layout composition, quality tooling, and room for feature modules.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={ROUTES.dashboard}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Open dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            to={ROUTES.login}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            View login
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-950">Template shell</h2>
        <div className="mt-5 grid gap-3">
          {capabilities.map((capability) => (
            <div
              key={capability}
              className="flex items-center gap-3 rounded-md border border-zinc-200 px-3 py-3"
            >
              <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" />
              <span className="text-sm font-medium text-zinc-700">{capability}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
