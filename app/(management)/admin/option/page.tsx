'use client'

import { OptionMetaData } from '#/model'
import { BreadcrumbsHeader } from '@/components/sidebar/breadcrumb-header'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { Pagination } from '@/components/ui/pagination'
import { SearchInput } from '@/components/ui/search-input'
import { OptionTable } from '@/features/option/option-table'
import { apiRoute, webRoute } from '@/lib/route'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const items = [
  {
    title: 'Tableau de bord',
    href: webRoute('dashboard'),
  },

  {
    title: 'Options',
    href: '#',
  },
]

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [page, setPage] = useState<number>(
    Number.parseInt(searchParams.get('page') || '1') || 1
  )
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<OptionMetaData>()

  useEffect(() => {
    setIsLoading(true)

    const getOptions = async () => {
      try {
        const response = await fetch(
          apiRoute('~option.index', { page, search })
        )

        if (!response.ok) {
          throw new Error(
            "Une erreur est survenue lors de l'affichage des options"
          )
        }

        const data = (await response.json()) as OptionMetaData

        setOptions(data)
      } catch (error) {
        console.error('Erreur lors de la récupération des départements:', error)
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
      router.push(webRoute('~option.index', { ...params, search }))
    } else {
      router.push(webRoute('~option.index', params))
    }
  }

  const onSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    setPage(1)

    router.push(webRoute('~option.index', { search: newSearch, page }))
  }

  const onReset = () => {
    setSearch('')
    setPage(1)
    router.push(webRoute('~option.index'))
  }

  return (
    <>
      <BreadcrumbsHeader items={items} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-5 md:min-h-min">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 justify-center">
                    <Loader />
                    <p className="text-sm text-muted-foreground">
                      Chargement...
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex items-center gap-4 justify-between">
                    {options &&
                      options.meta.links &&
                      options.meta.links.length > 2 && (
                        <div className="mb-5 flex justify-between items-start">
                          <SearchInput
                            onSearch={onSearchChange}
                            onReset={onReset}
                            lengthData={options.meta.total}
                            placeholder="Rechercher une option"
                          />
                        </div>
                      )}
                    <Button size="sm" variant="secondary">
                      <Link href={webRoute('~option.create')}>
                        <Plus size={15} />
                      </Link>
                    </Button>
                  </div>

                  {options && <OptionTable options={options.data} />}

                  {options && (
                    <div className="mt-8">
                      <Pagination
                        onPage={handlePageChange}
                        meta={options.meta}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
