import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form'
import { z, type ZodType } from 'zod'

type UseZodFormOptions<TInput extends FieldValues, TOutput> = Omit<
  UseFormProps<TInput, unknown, TOutput>,
  'resolver' | 'defaultValues'
> & {
  defaultValues?: DefaultValues<TInput>
}

/**
 * Tiny wrapper around `useForm` that wires up `zodResolver` for you and
 * threads the schema's input/output types through React Hook Form's
 * generics. The form values match `z.input<TSchema>` and the submit
 * handler receives `z.output<TSchema>`.
 *
 *   const form = useZodForm(loginSchema, {
 *     defaultValues: { email: '', password: '' },
 *   })
 *
 *   const onSubmit = form.handleSubmit((values) => { ... })
 */
export function useZodForm<TSchema extends ZodType<FieldValues, FieldValues>>(
  schema: TSchema,
  options: UseZodFormOptions<z.input<TSchema>, z.output<TSchema>> = {},
): UseFormReturn<z.input<TSchema>, unknown, z.output<TSchema>> {
  return useForm<z.input<TSchema>, unknown, z.output<TSchema>>({
    resolver: zodResolver(schema),
    ...options,
  })
}
