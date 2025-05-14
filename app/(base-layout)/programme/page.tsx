'use client'

import { Heading } from '@/components/shared/heading'
import { Pagination } from '@/components/ui/pagination'
import { fetchJson } from '@/lib/fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SearchInput } from '@/components/ui/search-input'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProgrammeMetaData } from '#/model'
import { ProgrammeCollection } from './programme-collection'
import { ProgrammeLoader } from './programme-loader'

export default function ProgrammeIndex() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [page, setPage] = useState<number>(
    Number.parseInt(searchParams.get('page') || '1') || 1
  )
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [programmes, setProgrammes] = useState<ProgrammeMetaData>()

  useEffect(() => {
    setIsLoading(true)

    const getProgrammes = async () => {
      try {
        const response = await fetchJson<ProgrammeMetaData>(
          apiLocalRoute('programme.index', { page, search })
        )

        if (response.status !== 200) {
          throw new Error(
            "Une erreur est survenue lors de l'affichage des options"
          )
        }

        setProgrammes(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des options:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getProgrammes()
  }, [page, search])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const params = { page: newPage }

    if (search && search.length > 0) {
      router.push(webRoute('programme.index', { ...params, search }))
    } else {
      router.push(webRoute('programme.index', params))
    }
  }

  const onSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    router.push(webRoute('programme.index', { search: newSearch, page }))
  }

  const onReset = () => {
    setSearch('')
    setPage(1)
    router.push(webRoute('programme.index'))
  }

  return (
    <div className="container py-12">
      <Heading title="Nos programmes" />

      {programmes &&
        programmes.meta.links &&
        programmes.meta.links.length > 2 && (
          <div className="mb-5 flex justify-between items-start">
            <SearchInput
              onSearch={onSearchChange}
              onReset={onReset}
              lengthData={programmes.meta.total}
              placeholder="Rechercher un programe"
            />
          </div>
        )}

      {isLoading ? (
        <ProgrammeLoader />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {programmes?.data.map((programme) => (
              <ProgrammeCollection key={programme.id} programme={programme} />
            ))}
          </div>

          {programmes && programmes.data.length === 0 && (
            <div className="text-center py-12 border rounded-lg mt-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucun programmes trouvé</h3>
              <p className="text-muted-foreground mt-2">
                Essayez de modifier vos critères de recherche ou consultez
                toutes nos options.
              </p>
              <Button onClick={onReset} className="mt-4">
                Voir toutes les programmes
              </Button>
            </div>
          )}

          {programmes && programmes.meta.last_page > 1 && (
            <div className="mt-8">
              <Pagination onPage={handlePageChange} meta={programmes.meta} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
