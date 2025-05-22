'use client'

import { Heading } from '@/components/shared/heading'
import { Pagination } from '@/components/ui/pagination'
import { apiRoute, webRoute } from '@/lib/route'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SearchInput } from '@/components/ui/search-input'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProfessorMetaData } from '#/model'
import { ProfessorCollection } from '@/features/professor/collection'

export default function ProfessorIndex() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page') || '1') || 1
  )
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [professors, setProfessors] = useState<ProfessorMetaData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    const getProfessors = async () => {
      try {
        const response = await fetch(
          apiRoute('professor.index', { page, search }),
          { method: 'GET', headers: { Accept: 'application/json' } }
        )

        if (!response.ok) {
          throw new Error(
            "Une erreur est survenue lors de l'affichage des professeurs"
          )
        }

        const data = await response.json()
        setProfessors(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }

    getProfessors()
  }, [page, search])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const params = { page: newPage }

    if (search && search.length > 0) {
      router.push(webRoute('professor.index', { ...params, search }))
    } else {
      router.push(webRoute('professor.index', params))
    }
  }

  const onSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    router.push(webRoute('professor.index', { search: newSearch, page }))
  }

  const onReset = () => {
    setSearch('')
    setPage(1)
    router.push(webRoute('professor.index'))
  }

  return (
    <div className="container py-12">
      <Heading title="Nos professeurs" />

      {professors?.meta?.links && professors.meta.links.length > 2 && (
        <div className="mb-5 flex justify-between items-start">
          <SearchInput
            onSearch={onSearchChange}
            onReset={onReset}
            lengthData={professors.meta.total}
            placeholder="Rechercher un professeur"
          />
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <div>Chargement...</div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">{error}</p>
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
          <div>
            <ProfessorCollection
              professors={professors ? professors.data : []}
            />
          </div>

          {professors?.data.length === 0 && (
            <div className="text-center py-12 border rounded-lg mt-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucun professeur trouvé</h3>
              <p className="text-muted-foreground mt-2">
                Essayez de modifier vos critères de recherche ou consultez tous
                nos professeurs.
              </p>
              <Button onClick={onReset} className="mt-4">
                Voir tous les professeurs
              </Button>
            </div>
          )}

          {professors?.meta?.last_page && professors?.meta?.last_page > 1 && (
            <div className="mt-8">
              <Pagination onPage={handlePageChange} meta={professors.meta} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
