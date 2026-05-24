import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from 'react'
import { Upload, X } from 'lucide-react'

import { cn } from '@/shared/lib'

import { Button } from './button'

type FileUploadProps = {
  value?: File[]
  defaultValue?: File[]
  onChange?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  disabled?: boolean
  className?: string
  label?: ReactNode
  hint?: ReactNode
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Drag-and-drop / click file picker with previews.
 *
 * - Controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 * - Renders image previews for files whose MIME type starts with `image/`.
 * - Validates size client-side via `maxSizeMb` and silently drops oversize
 *   files. For richer UX (e.g. surface a toast), wrap this with your own
 *   validation outside the component.
 */
export function FileUpload({
  value,
  defaultValue,
  onChange,
  accept,
  multiple,
  maxSizeMb,
  disabled,
  className,
  label = 'Drop files here or click to browse',
  hint,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<File[]>(defaultValue ?? [])
  const files = useMemo(
    () => (isControlled ? (value ?? []) : internal),
    [isControlled, value, internal],
  )
  const [isDragging, setIsDragging] = useState(false)

  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      })),
    [files],
  )

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.url) URL.revokeObjectURL(preview.url)
      })
    }
  }, [previews])

  const update = useCallback(
    (next: File[]) => {
      if (!isControlled) setInternal(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  const addFiles = useCallback(
    (incoming: FileList | File[] | null) => {
      if (!incoming || disabled) return
      const max = maxSizeMb ? maxSizeMb * 1024 * 1024 : Infinity
      const filtered = Array.from(incoming).filter((file) => file.size <= max)
      const next = multiple ? [...files, ...filtered] : filtered.slice(0, 1)
      update(next)
    },
    [disabled, files, maxSizeMb, multiple, update],
  )

  const removeAt = (index: number) => {
    const next = files.filter((_, i) => i !== index)
    update(next)
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files)
    // allow re-selecting the same file
    event.target.value = ''
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <div className={cn('grid gap-3', className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (disabled) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-zinc-50',
          isDragging
            ? 'border-zinc-950 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-800'
            : 'border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <Upload className="size-6 text-zinc-500 dark:text-zinc-400" aria-hidden />
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
        {hint ? <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p> : null}
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={onInputChange}
        />
      </div>

      {previews.length > 0 ? (
        <ul className="grid gap-2">
          {previews.map((preview, index) => (
            <li
              key={`${preview.file.name}-${index}`}
              className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
            >
              {preview.url ? (
                <img
                  src={preview.url}
                  alt=""
                  className="size-10 rounded-md object-cover"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-md bg-zinc-100 text-xs font-medium uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {preview.file.name.split('.').pop()?.slice(0, 4) ?? 'file'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {preview.file.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatBytes(preview.file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${preview.file.name}`}
                onClick={() => removeAt(index)}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
