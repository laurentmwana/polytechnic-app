'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationMeta {
  current_page: number
  from: number
  to: number
  last_page: number
  per_page: number
  total: number
}

interface PaginationProps {
  meta: PaginationMeta
  onPage: (page: number) => void
  className?: string
}

export function Pagination({ meta, onPage, className }: PaginationProps) {
  const { current_page, from, to, last_page, total } = meta

  if (total === 0) return null

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (last_page <= maxPagesToShow) {
      for (let i = 1; i <= last_page; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)

      let startPage = Math.max(2, current_page - 1)
      let endPage = Math.min(last_page - 1, current_page + 1)

      if (current_page <= 3) {
        endPage = Math.min(last_page - 1, 4)
      } else if (current_page >= last_page - 2) {
        startPage = Math.max(2, last_page - 3)
      }

      if (startPage > 2) {
        pageNumbers.push('...')
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      if (endPage < last_page - 1) {
        pageNumbers.push('...')
      }

      pageNumbers.push(last_page)
    }

    return pageNumbers
  }

  const handlePreviousPage = () => {
    if (current_page > 1) {
      onPage(current_page - 1)
    }
  }

  const handleNextPage = () => {
    if (current_page < last_page) {
      onPage(current_page + 1)
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row-reverse lg:justify-between items-center gap-3 py-6',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousPage}
          disabled={current_page === 1}
          aria-label="Page précédente"
          className="h-9 w-9 rounded-md border-muted-foreground/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1.5">
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
              >
                &#8230;
              </span>
            ) : (
              <Button
                key={`page-${page}`}
                variant={current_page === page ? 'default' : 'outline'}
                onClick={() => onPage(page as number)}
                className={cn(
                  'h-9 w-9 rounded-md text-sm font-medium',
                  current_page === page
                    ? 'shadow-sm'
                    : 'border-muted-foreground/20 hover:bg-muted'
                )}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={current_page === last_page}
          aria-label="Page suivante"
          className="h-9 w-9 rounded-md border-muted-foreground/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Affichage de <span className="font-medium">{from}</span> à{' '}
        <span className="font-medium">{to}</span> sur{' '}
        <span className="font-medium">{total}</span> résultats
      </div>
    </div>
  )
}

export const PaginationContent = () => null
export const PaginationItem = () => null
export const PaginationLink = () => null
export const PaginationEllipsis = () => null
export const PaginationPrevious = () => null
export const PaginationNext = () => null
