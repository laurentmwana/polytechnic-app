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
import { LevelMetaData } from '#/model'
import { LevelCollection } from './level-collection'
import { LevelLoader } from './level-loader'

export default function LevelIndex() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [page, setPage] = useState<number>(
    Number.parseInt(searchParams.get('page') || '1') || 1
  )
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [levels, setLevels] = useState<LevelMetaData>()

  useEffect(() => {
    setIsLoading(true)

    const getLevels = async () => {
      try {
        const response = await fetchJson<LevelMetaData>(
          apiLocalRoute('level.index', { page, search })
        )

        if (response.status !== 200) {
          throw new Error(
            "Une erreur est survenue lors de l'affichage des promotions"
          )
        }

        setLevels(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des promotions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getLevels()
  }, [page, search])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const params = { page: newPage }

    if (search && search.length > 0) {
      router.push(webRoute('level.index', { ...params, search }))
    } else {
      router.push(webRoute('level.index', params))
    }
  }

  const onSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    router.push(webRoute('level.index', { search: newSearch, page }))
  }

  const onReset = () => {
    setSearch('')
    setPage(1)
    router.push(webRoute('level.index'))
  }

  return (
    <div className="container py-12">
      <Heading title="Les promotions" />

      {levels && levels.meta.links && levels.meta.links.length > 2 && (
        <div className="mb-5 flex justify-between items-start">
          <SearchInput
            onSearch={onSearchChange}
            onReset={onReset}
            lengthData={levels.meta.total}
            placeholder="Rechercher une promotion"
          />
        </div>
      )}

      {isLoading ? (
        <LevelLoader />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {levels?.data.map((level) => (
              <LevelCollection key={level.id} level={level} />
            ))}
          </div>

          {levels && levels.data.length === 0 && (
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

          {levels && levels.meta.last_page > 1 && (
            <div className="mt-8">
              <Pagination onPage={handlePageChange} meta={levels.meta} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
