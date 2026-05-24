import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:focus:ring-zinc-50',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950',
        secondary:
          'border-transparent bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
        outline: 'border-zinc-300 text-zinc-950 dark:border-zinc-700 dark:text-zinc-100',
        destructive: 'border-transparent bg-red-600 text-white',
        success: 'border-transparent bg-emerald-600 text-white',
        warning: 'border-transparent bg-amber-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
