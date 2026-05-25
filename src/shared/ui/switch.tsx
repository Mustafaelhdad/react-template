import { useCallback, useState, type KeyboardEvent } from 'react'

import { cn } from '@/shared/lib'

type SwitchProps = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  ...props
}: SwitchProps) {
  const isControlled = checked !== undefined
  const [internal, setInternal] = useState(defaultChecked ?? false)
  const value = isControlled ? checked : internal

  const toggle = useCallback(() => {
    if (disabled) return
    const next = !value
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }, [disabled, isControlled, onCheckedChange, value])

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      toggle()
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      data-state={value ? 'checked' : 'unchecked'}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={handleKey}
      className={cn(
        'peer inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:outline-zinc-50',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          value ? 'bg-zinc-950 dark:bg-zinc-50' : 'bg-zinc-200 dark:bg-zinc-700',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform dark:bg-zinc-950',
            value ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0',
          )}
        />
      </span>
    </button>
  )
}
