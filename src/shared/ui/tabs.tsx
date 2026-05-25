import * as TabsPrimitive from '@radix-ui/react-tabs'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib'

export const Tabs = TabsPrimitive.Root

export function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <div className="w-full overflow-x-auto">
      <TabsPrimitive.List
        className={cn(
          'inline-flex min-h-12 min-w-max items-center justify-center rounded-md bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:focus-visible:outline-zinc-50 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'mt-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-zinc-50',
        className,
      )}
      {...props}
    />
  )
}
