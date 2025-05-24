'use client'

import { Heading } from '@/components/shared/heading'
import { Pagination } from '@/components/ui/pagination'
import { apiRoute, webRoute } from '@/lib/route'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { DeliberationMetaData } from '#/model'
import { DepartmentWelcomeSkeleton } from '@/features/welcome/department'
import { SearchInput } from '@/components/ui/search-input'
import { DeliberationsCollection } from '@/features/deliberation/collection'

export default function LaboratoryIndex() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page') || '1') || 1
  )
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [deliberations, setDeliberations] =
    useState<DeliberationMetaData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    const getDeliberation = async () => {
      try {
        const response = await fetch(
          apiRoute('deliberation.index', { page, search }),
          { method: 'GET', headers: { Accept: 'application/json' } }
        )

        if (!response.ok) {
          throw new Error(
            "Une erreur est survenue lors de l'affichage des délibérations"
          )
        }

        const data = await response.json()

        setDeliberations(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erreur inconnue')
        console.error(
          'Erreur lors de la récupération des délibérations:',
          error
        )
      } finally {
        setIsLoading(false)
      }
    }

    getDeliberation()
  }, [page, search])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const params = { page: newPage }

    if (search && search.length > 0) {
      router.push(webRoute('deliberation.index', { ...params, search }))
    } else {
      router.push(webRoute('deliberation.index', params))
    }
  }

  const onSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    router.push(webRoute('deliberation.index', { search: newSearch, page }))
  }

  const onReset = () => {
    setSearch('')
    setPage(1)
    router.push(webRoute('deliberation.index'))
  }

  return (
    <div className="container py-12">
      <Heading title="Délibération" />

      {deliberations &&
        deliberations.meta.links &&
        deliberations.meta.links.length > 2 && (
          <div className="mb-5 flex justify-between items-start">
            <SearchInput
              onSearch={onSearchChange}
              onReset={onReset}
              lengthData={deliberations.meta.total}
              placeholder="Rechercher une délibération"
            />
          </div>
        )}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <DepartmentWelcomeSkeleton />
        </div>
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
          <DeliberationsCollection
            deliberations={deliberations ? deliberations.data : []}
          />

          {deliberations && (
            <div className="mt-8">
              <Pagination onPage={handlePageChange} meta={deliberations.meta} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
