import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-zinc-950 text-white hover:bg-zinc-800 focus-visible:outline-zinc-950',
        secondary:
          'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 focus-visible:outline-zinc-400',
        ghost:
          'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-zinc-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-5',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)
