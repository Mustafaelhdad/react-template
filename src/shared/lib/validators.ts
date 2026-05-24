import { z } from 'zod'

/**
 * Reusable Zod schemas for common form inputs.
 *
 * Compose these inside feature schemas instead of re-deriving the same
 * constraints in every form:
 *
 *   const profileSchema = z.object({
 *     name: requiredString('Name is required'),
 *     email: emailSchema,
 *     website: urlSchema.optional(),
 *   })
 */

export const emailSchema = z.email({ message: 'Enter a valid email address' })

export const urlSchema = z.url({ message: 'Enter a valid URL' })

/**
 * Phone number, permissive: allows digits, spaces, dashes, parens, and an
 * optional leading +. Minimum 7 characters once trimmed. Real-world phone
 * validation is locale-specific — replace with `libphonenumber-js` if your
 * project needs strict checks.
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(7, { message: 'Phone number is too short' })
  .regex(/^\+?[\d\s()-]+$/, { message: 'Enter a valid phone number' })

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(/[a-z]/, { message: 'Include at least one lowercase letter' })
  .regex(/[A-Z]/, { message: 'Include at least one uppercase letter' })
  .regex(/\d/, { message: 'Include at least one number' })

/**
 * String that must be non-empty after trimming. Pass a custom message for the
 * specific field name ("Title is required") so error UX reads naturally.
 */
export function requiredString(message = 'This field is required') {
  return z.string().trim().min(1, { message })
}

/**
 * Confirms two password fields match. Apply to the parent object with
 * `.superRefine` or `.refine`:
 *
 *   const schema = z
 *     .object({ password: passwordSchema, confirm: z.string() })
 *     .refine(matchesPassword('password', 'confirm'), {
 *       message: 'Passwords do not match',
 *       path: ['confirm'],
 *     })
 */
export function matchesPassword<T extends Record<string, unknown>>(
  passwordKey: keyof T,
  confirmKey: keyof T,
) {
  return (data: T) => data[passwordKey] === data[confirmKey]
}
