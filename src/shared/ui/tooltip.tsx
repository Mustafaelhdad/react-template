import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ComponentProps } from 'react'

import { useMediaQuery } from '@/shared/lib/hooks/use-media-query'
import { cn } from '@/shared/lib'

export const TooltipProvider = TooltipPrimitive.Provider
export const TooltipTrigger = TooltipPrimitive.Trigger

type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root> & {
  disableOnTouch?: boolean
}

export function Tooltip({
  disableOnTouch = true,
  open,
  defaultOpen,
  ...props
}: TooltipProps) {
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const disabled = disableOnTouch && !canHover

  return (
    <TooltipPrimitive.Root
      open={disabled ? false : open}
      defaultOpen={disabled ? false : defaultOpen}
      {...props}
    />
  )
}

export function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 overflow-hidden rounded-md bg-zinc-950 px-3 py-1.5 text-xs text-white shadow-md data-[state=delayed-open]:animate-in dark:bg-zinc-50 dark:text-zinc-950',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}
