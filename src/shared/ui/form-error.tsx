import { CircleAlert } from 'lucide-react'

type FormErrorProps = {
  message?: string
}

export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null
  }

  return (
    <p className="flex items-center gap-2 text-sm font-medium text-red-600">
      <CircleAlert className="size-4" aria-hidden="true" />
      {message}
    </p>
  )
}
