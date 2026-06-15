import * as PopoverPrimitive from '@radix-ui/react-popover'
import { ar, enUS } from 'date-fns/locale'
import { CalendarDays, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

import { cn, useDirection } from '@/shared/lib'

const DATE_FNS_LOCALES = { en: enUS, ar } as const

function parseIsoDate(value: string): Date | undefined {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) {
    return undefined
  }
  return new Date(year, month - 1, day)
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

type DateFieldProps = {
  id?: string
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

/**
 * Date picker backed by a Radix popover and `react-day-picker`. Stores and
 * emits dates as `YYYY-MM-DD` strings, and follows the active i18next
 * language for display formatting, calendar locale, and direction.
 */
export function DateField({
  id,
  value = '',
  onValueChange,
  placeholder,
  disabled,
  className,
}: DateFieldProps) {
  const { t, i18n } = useTranslation()
  const direction = useDirection()
  const [open, setOpen] = useState(false)

  const language = i18n.resolvedLanguage ?? i18n.language
  const dateFnsLocale =
    DATE_FNS_LOCALES[language as keyof typeof DATE_FNS_LOCALES] ?? enUS
  const displayFormatter = new Intl.DateTimeFormat(language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const numberFormatter = new Intl.NumberFormat(language)

  const selected = value ? parseIsoDate(value) : undefined
  const display = selected ? displayFormatter.format(selected) : ''

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            id={id}
            disabled={disabled}
            className={cn(
              'flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-start text-sm shadow-sm transition-colors focus:border-zinc-950 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:disabled:bg-zinc-800',
              display
                ? 'text-zinc-950 dark:text-zinc-50'
                : 'text-zinc-400 dark:text-zinc-500',
              className,
            )}
          >
            <span>{display || placeholder || t('dateField.placeholder')}</span>
            <CalendarDays className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
          </button>
        </PopoverPrimitive.Trigger>

        {display ? (
          <button
            type="button"
            onClick={() => onValueChange('')}
            disabled={disabled}
            aria-label={t('dateField.clear')}
            className="absolute inset-y-0 end-9 my-auto flex size-5 items-center justify-center rounded text-zinc-400 hover:text-zinc-600 focus:outline-none dark:hover:text-zinc-200"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          dir={direction}
          className="z-50 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <DayPicker
            mode="single"
            locale={dateFnsLocale}
            dir={direction}
            selected={selected}
            defaultMonth={selected}
            onSelect={(date) => {
              onValueChange(date ? toIsoDate(date) : '')
              setOpen(false)
            }}
            formatters={{
              formatDay: (date) => numberFormatter.format(date.getDate()),
            }}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
