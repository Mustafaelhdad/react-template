import ReactSelect, {
  type ClassNamesConfig,
  type GroupBase,
  type Props as ReactSelectProps,
} from 'react-select'

import { cn } from '@/shared/lib'

export type SelectOption = {
  value: string
  label: string
  isDisabled?: boolean
}

export type SearchableSelectProps<
  TOption extends SelectOption,
  TIsMulti extends boolean = false,
> = Omit<
  ReactSelectProps<TOption, TIsMulti, GroupBase<TOption>>,
  'classNames' | 'styles' | 'unstyled'
> & {
  isInvalid?: boolean
}

export type MultiSelectProps<TOption extends SelectOption> = Omit<
  SearchableSelectProps<TOption, true>,
  'isMulti'
>

function searchableSelectClassNames<
  TOption extends SelectOption,
  TIsMulti extends boolean,
>(isInvalid?: boolean): ClassNamesConfig<TOption, TIsMulti, GroupBase<TOption>> {
  return {
    container: () => 'w-full',
    control: ({ isDisabled, isFocused }) =>
      cn(
        'min-h-11 rounded-md border bg-white text-sm text-zinc-950 shadow-sm transition-colors',
        'dark:bg-zinc-900 dark:text-zinc-50',
        isFocused
          ? 'border-zinc-950 dark:border-zinc-200'
          : 'border-zinc-300 dark:border-zinc-700',
        isInvalid && 'border-red-500 dark:border-red-500',
        isDisabled && 'cursor-not-allowed bg-zinc-100 opacity-70 dark:bg-zinc-800',
      ),
    valueContainer: () => 'gap-1 px-2 py-1',
    input: () => 'text-zinc-950 dark:text-zinc-50',
    placeholder: () => 'text-zinc-400 dark:text-zinc-500',
    singleValue: () => 'text-zinc-950 dark:text-zinc-50',
    multiValue: () =>
      'rounded-md bg-zinc-100 text-zinc-900 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:ring-zinc-700',
    multiValueLabel: () => 'px-2 py-0.5 text-zinc-900 dark:text-zinc-50',
    multiValueRemove: () =>
      'rounded-r-md px-1 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-50',
    indicatorsContainer: () => 'text-zinc-400 dark:text-zinc-500',
    dropdownIndicator: () =>
      'px-2 text-zinc-400 transition-colors hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50',
    clearIndicator: () =>
      'px-2 text-zinc-400 transition-colors hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50',
    indicatorSeparator: () => 'my-2 bg-zinc-200 dark:bg-zinc-700',
    menu: () =>
      'z-[60] mt-1 overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900',
    menuList: () => 'max-h-64 py-1',
    option: ({ isDisabled, isFocused, isSelected }) =>
      cn(
        'cursor-pointer px-3 py-2 text-sm text-zinc-950 transition-colors dark:text-zinc-50',
        isSelected && 'bg-zinc-100 dark:bg-zinc-800',
        !isSelected && isFocused && 'bg-zinc-50 dark:bg-zinc-800/70',
        isDisabled && 'cursor-not-allowed opacity-50',
      ),
    noOptionsMessage: () => 'px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400',
    loadingMessage: () => 'px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400',
    groupHeading: () =>
      'px-3 py-2 text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400',
  }
}

/**
 * Searchable dropdown built on `react-select`, styled to match the template's
 * `Select`/`Input` primitives. Use for large option lists where typing to
 * filter is more usable than a native `<select>`.
 */
export function SearchableSelect<
  TOption extends SelectOption,
  TIsMulti extends boolean = false,
>({ isInvalid, ...props }: SearchableSelectProps<TOption, TIsMulti>) {
  return (
    <ReactSelect<TOption, TIsMulti, GroupBase<TOption>>
      unstyled
      classNames={searchableSelectClassNames<TOption, TIsMulti>(isInvalid)}
      aria-invalid={isInvalid ? 'true' : undefined}
      {...props}
    />
  )
}

/** `SearchableSelect` pre-configured for multi-value selection. */
export function MultiSelect<TOption extends SelectOption>(
  props: MultiSelectProps<TOption>,
) {
  return <SearchableSelect<TOption, true> isMulti {...props} />
}
