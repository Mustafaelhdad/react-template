import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib'

export const DropdownMenu = DropdownPrimitive.Root
export const DropdownMenuTrigger = DropdownPrimitive.Trigger
export const DropdownMenuGroup = DropdownPrimitive.Group
export const DropdownMenuPortal = DropdownPrimitive.Portal
export const DropdownMenuSub = DropdownPrimitive.Sub
export const DropdownMenuRadioGroup = DropdownPrimitive.RadioGroup

const menuItemBase =
  'relative flex min-h-11 cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-950 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:data-[highlighted]:bg-zinc-800 dark:data-[highlighted]:text-zinc-50'

export function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[12rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 text-zinc-900 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100',
          className,
        )}
        {...props}
      />
    </DropdownPrimitive.Portal>
  )
}

export function DropdownMenuItem({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Item>) {
  return <DropdownPrimitive.Item className={cn(menuItemBase, className)} {...props} />
}

export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownPrimitive.CheckboxItem>) {
  return (
    <DropdownPrimitive.CheckboxItem
      className={cn(menuItemBase, 'pl-8', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownPrimitive.ItemIndicator>
          <Check className="size-3.5" />
        </DropdownPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownPrimitive.CheckboxItem>
  )
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownPrimitive.RadioItem>) {
  return (
    <DropdownPrimitive.RadioItem
      className={cn(menuItemBase, 'pl-8', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </DropdownPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownPrimitive.RadioItem>
  )
}

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Label>) {
  return (
    <DropdownPrimitive.Label
      className={cn(
        'px-2 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Separator>) {
  return (
    <DropdownPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-zinc-200 dark:bg-zinc-800', className)}
      {...props}
    />
  )
}

export function DropdownMenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-zinc-400 dark:text-zinc-500',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownPrimitive.SubTrigger>) {
  return (
    <DropdownPrimitive.SubTrigger
      className={cn(
        menuItemBase,
        'data-[state=open]:bg-zinc-100 dark:data-[state=open]:bg-zinc-800',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4" />
    </DropdownPrimitive.SubTrigger>
  )
}

export function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.SubContent>) {
  return (
    <DropdownPrimitive.SubContent
      className={cn(
        'z-50 min-w-[12rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 shadow-md dark:border-zinc-800 dark:bg-zinc-900',
        className,
      )}
      {...props}
    />
  )
}
