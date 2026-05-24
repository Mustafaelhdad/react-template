import { LoaderCircle } from 'lucide-react'

type LoadingScreenProps = {
  label?: string
}

export function LoadingScreen({ label = 'Loading' }: LoadingScreenProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-zinc-50 text-zinc-700">
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <LoaderCircle
          className="size-5 animate-spin text-emerald-600"
          aria-hidden="true"
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  )
}
