'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
}

export function Pagination({ meta, onPage }: PaginationProps) {
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
    <div className="flex flex-col items-center space-y-2 py-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousPage}
          disabled={current_page === 1}
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={current_page === page ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPage(page as number)}
              className="w-9 h-9"
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={current_page === last_page}
          aria-label="Page suivante"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Affichage de {from} à {to} sur {total} résultats
      </div>
    </div>
  )
}
