'use client'

import { Heading } from '@/components/shared/heading'
import { Pagination } from '@/components/ui/pagination'
import { fetchJson } from '@/lib/fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { NewsMetaData } from '#/model'
import { SearchInput } from '@/components/ui/search-input'
import { NewsCollection } from '@/features/news/news-collection'
import { NewsCollectionSkeleton } from '@/features/news/news-skeleton'

export default function NewsIndex() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [page, setPage] = useState<number>(
    Number.parseInt(searchParams.get('page') || '1') || 1
  )
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [news, setNews] = useState<NewsMetaData>()

  useEffect(() => {
    setIsLoading(true)

    const getNews = async () => {
      try {
        const response = await fetchJson<NewsMetaData>(
          apiLocalRoute('news.index', { page, search })
        )

        if (response.status !== 200) {
          throw new Error(
            "Une erreur est survenue lors de l'affichage des news"
          )
        }

        setNews(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des news:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getNews()
  }, [page, search])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const params = { page: newPage }

    if (search && search.length > 0) {
      router.push(webRoute('news.index', { ...params, search }))
    } else {
      router.push(webRoute('news.index', params))
    }
  }

  const onSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    router.push(webRoute('news.index', { search: newSearch, page }))
  }

  const onReset = () => {
    setSearch('')
    setPage(1)
    router.push(webRoute('news.index'))
  }
  return (
    <div className="container py-12">
      <Heading title="Les communiqués" />

      {news && news.meta.links && news.meta.links.length > 2 && (
        <div className="mb-5 flex justify-between items-start">
          <SearchInput
            onSearch={onSearchChange}
            onReset={onReset}
            lengthData={news.meta.total}
            placeholder="Rechercher un news"
          />
        </div>
      )}

      {isLoading ? (
        <NewsCollectionSkeleton />
      ) : (
        <>
          <NewsCollection news={news ? news.data : []} />

          {news && (
            <div className="mt-8">
              <Pagination onPage={handlePageChange} meta={news.meta} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
