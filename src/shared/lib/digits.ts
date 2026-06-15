const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'
const EXTENDED_ARABIC_INDIC_DIGITS = '۰۱۲۳۴۵۶۷۸۹'

/**
 * Converts Arabic-Indic (`٠-٩`) and Extended Arabic-Indic (`۰-۹`) digits to
 * their ASCII equivalents. Arabic/Persian keyboards often emit these for
 * numeric input, which `Number()` and numeric Zod schemas can't parse.
 */
export function toEnglishDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (char) => {
    const arabicIndex = ARABIC_INDIC_DIGITS.indexOf(char)
    if (arabicIndex !== -1) return String(arabicIndex)

    return String(EXTENDED_ARABIC_INDIC_DIGITS.indexOf(char))
  })
}

type SanitizeNumericOptions = {
  /** Allow a single decimal point. Defaults to `false`. */
  allowDecimal?: boolean
  /** Allow a leading minus sign. Defaults to `false`. */
  allowNegative?: boolean
}

/**
 * Converts Arabic-Indic digits to ASCII, then strips everything except
 * digits (and, optionally, a leading minus sign and a decimal point). Use on
 * `onChange` for numeric text inputs so the value is always safe to pass to
 * `Number()` or a numeric Zod schema, regardless of the keyboard layout.
 */
export function sanitizeNumericInput(
  value: string,
  options: SanitizeNumericOptions = {},
): string {
  const { allowDecimal = false, allowNegative = false } = options
  const normalized = toEnglishDigits(value)

  const isNegative = allowNegative && normalized.trimStart().startsWith('-')
  let digits = normalized.replace(/[^\d.]/g, '')

  if (allowDecimal) {
    const [whole, ...rest] = digits.split('.')
    digits = rest.length > 0 ? `${whole}.${rest.join('')}` : whole
  } else {
    digits = digits.replace(/\./g, '')
  }

  return isNegative ? `-${digits}` : digits
}
