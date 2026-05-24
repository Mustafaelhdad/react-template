import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/shared/lib'

import { Button } from './button'

type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  siblings?: number
  className?: string
}

const DOTS = '…' as const
type PageItem = number | typeof DOTS

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function buildPages(page: number, pageCount: number, siblings: number): PageItem[] {
  const total = siblings * 2 + 5
  if (pageCount <= total) {
    return range(1, pageCount)
  }

  const leftSibling = Math.max(page - siblings, 1)
  const rightSibling = Math.min(page + siblings, pageCount)
  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < pageCount - 1

  if (!showLeftDots && showRightDots) {
    return [...range(1, 3 + siblings * 2), DOTS, pageCount]
  }
  if (showLeftDots && !showRightDots) {
    return [1, DOTS, ...range(pageCount - (2 + siblings * 2), pageCount)]
  }
  return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, pageCount]
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblings = 1,
  className,
}: PaginationProps) {
  const pages = useMemo(
    () => buildPages(page, pageCount, siblings),
    [page, pageCount, siblings],
  )

  if (pageCount <= 1) return null

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('flex items-center gap-1', className)}
    >
      <Button
        variant="secondary"
        size="icon"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
      </Button>
      {pages.map((item, index) =>
        item === DOTS ? (
          <span
            key={`dots-${index}`}
            aria-hidden
            className="px-2 text-sm text-zinc-500 dark:text-zinc-400"
          >
            {DOTS}
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? 'primary' : 'secondary'}
            size="icon"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        variant="secondary"
        size="icon"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}
