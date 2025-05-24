'use client'

import { Heading } from '@/components/shared/heading'
import { Pagination } from '@/components/ui/pagination'
import { apiRoute, webRoute } from '@/lib/route'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SearchInput } from '@/components/ui/search-input'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OptionMetaData } from '#/model'
import { OptionCollection } from '@/features/option/option-collection'
import { OptionLoader } from '@/features/option/option-loader'

export default function OptionIndex() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page') || '1') || 1
  )
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<OptionMetaData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    const getOptions = async () => {
      try {
        const response = await fetch(
          apiRoute('option.index', { page, search }),
          { method: 'GET', headers: { Accept: 'application/json' } }
        )

        if (!response.ok) {
          throw new Error(
            "Une erreur est survenue lors de l'affichage des options"
          )
        }

        const data = await response.json()
        setOptions(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erreur inconnue')
        console.error('Erreur lors de la récupération des options:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getOptions()
  }, [page, search])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const params = { page: newPage }

    if (search && search.length > 0) {
      router.push(webRoute('option.index', { ...params, search }))
    } else {
      router.push(webRoute('option.index', params))
    }
  }

  const onSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    router.push(webRoute('option.index', { search: newSearch, page }))
  }

  const onReset = () => {
    setSearch('')
    setPage(1)
    router.push(webRoute('option.index'))
  }

  return (
    <div className="container py-12">
      <Heading title="Nos options" />

      {options?.meta?.links && options.meta.links.length > 2 && (
        <div className="mb-5 flex justify-between items-start">
          <SearchInput
            onSearch={onSearchChange}
            onReset={onReset}
            lengthData={options.meta.total}
            placeholder="Rechercher une option"
          />
        </div>
      )}

      {isLoading ? (
        <OptionLoader />
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => {
              setPage(1)
              setSearch('')
            }}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {options?.data.map((option) => (
              <OptionCollection key={option.id} option={option} />
            ))}
          </div>

          {options?.data.length === 0 && (
            <div className="text-center py-12 border rounded-lg mt-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucune option trouvée</h3>
              <p className="text-muted-foreground mt-2">
                Essayez de modifier vos critères de recherche ou consultez
                toutes nos options.
              </p>
              <Button onClick={onReset} className="mt-4">
                Voir toutes les options
              </Button>
            </div>
          )}

          {options?.meta?.last_page && options?.meta?.last_page > 1 && (
            <div className="mt-8">
              <Pagination onPage={handlePageChange} meta={options.meta} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
