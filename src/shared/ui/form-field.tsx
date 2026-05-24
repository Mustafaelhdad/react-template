import { useId, type ComponentProps, type ReactNode } from 'react'
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

import { cn } from '@/shared/lib'

import { FormError } from './form-error'
import { Input } from './input'
import { Label } from './label'

type FormFieldRenderArgs<TForm extends FieldValues, TName extends FieldPath<TForm>> = {
  field: ControllerRenderProps<TForm, TName>
  fieldState: ControllerFieldState
  id: string
}

type FormFieldProps<TForm extends FieldValues, TName extends FieldPath<TForm>> = {
  control: Control<TForm>
  name: TName
  label?: ReactNode
  description?: ReactNode
  className?: string
  /**
   * Props forwarded to the default `<Input />` when `children` is not used.
   * Ignored when `children` is provided.
   */
  inputProps?: Omit<ComponentProps<typeof Input>, 'id' | 'name'>
  /**
   * Render a custom field. Use when the input is not a standard text input
   * (textarea, select, switch, custom widget). Defaults to `<Input />`.
   */
  children?: (args: FormFieldRenderArgs<TForm, TName>) => ReactNode
}

/**
 * Ties a React Hook Form `Controller` to a `Label`, an input, and a
 * `FormError`. Pass `children` as a render prop for non-text inputs.
 *
 *   <FormField control={form.control} name="email" label="Email" />
 *
 *   <FormField control={form.control} name="bio" label="Bio">
 *     {({ field, id }) => <Textarea id={id} {...field} />}
 *   </FormField>
 */
export function FormField<TForm extends FieldValues, TName extends FieldPath<TForm>>({
  control,
  name,
  label,
  description,
  className,
  inputProps,
  children,
}: FormFieldProps<TForm, TName>) {
  const generatedId = useId()
  const id = `${generatedId}-${name}`
  const descriptionId = description ? `${id}-description` : undefined

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn('grid gap-2', className)}>
          {label ? <Label htmlFor={id}>{label}</Label> : null}
          {children ? (
            children({ field, fieldState, id })
          ) : (
            <Input
              id={id}
              aria-invalid={fieldState.error ? 'true' : undefined}
              aria-describedby={descriptionId}
              {...inputProps}
              {...field}
              value={field.value ?? ''}
            />
          )}
          {description ? (
            <p id={descriptionId} className="text-xs text-zinc-500">
              {description}
            </p>
          ) : null}
          <FormError message={fieldState.error?.message} />
        </div>
      )}
    />
  )
}
