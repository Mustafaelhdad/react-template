import { Minus, Plus } from 'lucide-react'
import type { ChangeEvent, ComponentProps } from 'react'

import { cn, sanitizeNumericInput } from '@/shared/lib'

type NumberInputProps = Omit<
  ComponentProps<'input'>,
  'type' | 'value' | 'onChange' | 'min' | 'max' | 'step'
> & {
  value?: string
  onChange?: (value: string) => void
  /** Show decrement/increment buttons alongside the field. Defaults to `false`. */
  controls?: boolean
  min?: number
  max?: number
  /** Step used by the increment/decrement buttons. Defaults to `1`. */
  step?: number
  /** Allow a single decimal point. Defaults to `false`. */
  allowDecimal?: boolean
  /** Allow a leading minus sign. Defaults to `false`. */
  allowNegative?: boolean
}

/**
 * Numeric text field. Renders as `type="text"` (not `type="number"`) so it
 * never falls back to locale-specific digit rendering or native spinners,
 * while still sanitizing every keystroke to ASCII digits via
 * {@link sanitizeNumericInput}. Pass `controls` to add +/- step buttons.
 */
export function NumberInput({
  className,
  value = '',
  onChange,
  controls = false,
  min,
  max,
  step = 1,
  allowDecimal = false,
  allowNegative = false,
  disabled,
  ...props
}: NumberInputProps) {
  const clamp = (next: number) => {
    let result = next
    if (min !== undefined) result = Math.max(min, result)
    if (max !== undefined) result = Math.min(max, result)
    return result
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(sanitizeNumericInput(event.target.value, { allowDecimal, allowNegative }))
  }

  const handleStep = (direction: 1 | -1) => {
    const current = Number.parseFloat(value) || 0
    onChange?.(String(clamp(current + direction * step)))
  }

  const currentValue = Number.parseFloat(value) || 0
  const atMin = min !== undefined && currentValue <= min
  const atMax = max !== undefined && currentValue >= max

  return (
    <div
      className={cn(
        'flex min-h-11 w-full items-stretch rounded-md border border-zinc-300 bg-white text-sm shadow-sm transition-colors focus-within:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-zinc-200',
        disabled && 'cursor-not-allowed bg-zinc-100 opacity-70 dark:bg-zinc-800',
        className,
      )}
    >
      {controls ? (
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled || atMin}
          onClick={() => handleStep(-1)}
          aria-label="Decrease value"
          className="flex items-center justify-center rounded-s-md px-3 text-zinc-500 transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Minus className="size-4" />
        </button>
      ) : null}
      <input
        type="text"
        inputMode={allowDecimal ? 'decimal' : 'numeric'}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-zinc-950 placeholder:text-zinc-400 focus:outline-none disabled:cursor-not-allowed dark:text-zinc-50 dark:placeholder:text-zinc-500"
        {...props}
      />
      {controls ? (
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled || atMax}
          onClick={() => handleStep(1)}
          aria-label="Increase value"
          className="flex items-center justify-center rounded-e-md px-3 text-zinc-500 transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Plus className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
