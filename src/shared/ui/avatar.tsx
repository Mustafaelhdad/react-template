import { useState, type ComponentProps, type ReactNode } from 'react'

import { cn } from '@/shared/lib'

type AvatarProps = ComponentProps<'div'> & {
  src?: string | null
  alt?: string
  fallback?: ReactNode
}

export function Avatar({ className, src, alt = '', fallback, ...props }: AvatarProps) {
  const [errored, setErrored] = useState(false)
  const showImage = Boolean(src) && !errored

  return (
    <div
      className={cn(
        'relative flex size-10 shrink-0 overflow-hidden rounded-full bg-zinc-100 text-sm font-medium text-zinc-700',
        className,
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src ?? ''}
          alt={alt}
          onError={() => setErrored(true)}
          className="aspect-square size-full object-cover"
        />
      ) : (
        <span className="flex size-full items-center justify-center uppercase">
          {fallback}
        </span>
      )}
    </div>
  )
}
