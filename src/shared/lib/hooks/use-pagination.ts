import { useCallback, useMemo, useState } from 'react'

export type UsePaginationOptions = {
  total: number
  perPage: number
  initialPage?: number
}

export type UsePaginationResult = {
  page: number
  perPage: number
  total: number
  pageCount: number
  startIndex: number
  endIndex: number
  hasPrev: boolean
  hasNext: boolean
  setPage: (page: number) => void
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
}

function clampPage(page: number, pageCount: number): number {
  if (pageCount <= 1) return 1
  if (page < 1) return 1
  if (page > pageCount) return pageCount
  return page
}

/**
 * Tracks 1-indexed pagination state for a known `total` of items at
 * `perPage` size. Returns derived bounds and stable navigation helpers.
 */
export function usePagination({
  total,
  perPage,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationResult {
  const pageCount = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, perPage)))
  const [page, setPageState] = useState(() => clampPage(initialPage, pageCount))

  const setPage = useCallback(
    (next: number) => setPageState(clampPage(next, pageCount)),
    [pageCount],
  )
  const next = useCallback(() => setPage(page + 1), [page, setPage])
  const prev = useCallback(() => setPage(page - 1), [page, setPage])
  const first = useCallback(() => setPage(1), [setPage])
  const last = useCallback(() => setPage(pageCount), [pageCount, setPage])

  return useMemo(() => {
    const safePage = clampPage(page, pageCount)
    const startIndex = (safePage - 1) * perPage
    const endIndex = Math.min(startIndex + perPage, Math.max(0, total))
    return {
      page: safePage,
      perPage,
      total,
      pageCount,
      startIndex,
      endIndex,
      hasPrev: safePage > 1,
      hasNext: safePage < pageCount,
      setPage,
      next,
      prev,
      first,
      last,
    }
  }, [page, pageCount, perPage, total, setPage, next, prev, first, last])
}
