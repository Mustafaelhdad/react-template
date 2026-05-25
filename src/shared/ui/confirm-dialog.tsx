import { useTranslation } from 'react-i18next'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /**
   * When true the confirm button uses the `danger` variant. Use for
   * destructive actions (delete, sign-out, discard changes).
   */
  destructive?: boolean
  onConfirm: () => void
  onCancel?: () => void
}

/**
 * Presentational confirm dialog built on the shared `Dialog` primitive.
 * The promise-returning `useConfirm()` hook in `@/shared/lib` wraps this
 * component — most app code should reach for that hook instead of
 * rendering this directly.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  const resolvedConfirmLabel = confirmLabel ?? t('common.confirm')
  const resolvedCancelLabel = cancelLabel ?? t('common.cancel')

  const handleOpenChange = (next: boolean) => {
    // Treat any "close" event (escape, overlay click, X button) as a
    // cancel so the resolving Promise doesn't hang.
    if (!next) onCancel?.()
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onCancel?.()
              onOpenChange(false)
            }}
          >
            {resolvedCancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {resolvedConfirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
