'use client'

import { Heading } from '@/components/shared/heading'
import { Pagination } from '@/components/ui/pagination'
import { apiRoute, webRoute } from '@/lib/route'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { DepartmentMetaData } from '#/model'
import {
  DepartmentWelcomeItem,
  DepartmentWelcomeSkeleton,
} from '@/features/welcome/department'
import { SearchInput } from '@/components/ui/search-input'

export default function DepartmentIndex() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page') || '1') || 1
  )
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [departments, setDepartments] = useState<DepartmentMetaData | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    const getDepartments = async () => {
      try {
        const response = await fetch(
          apiRoute('department.index', { page, search }),
          { method: 'GET', headers: { Accept: 'application/json' } }
        )

        if (!response.ok) {
          throw new Error(
            "Une erreur est survenue lors de l'affichage des départements"
          )
        }

        const data = await response.json()
        setDepartments(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erreur inconnue')
        console.error('Erreur lors de la récupération des départements:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getDepartments()
  }, [page, search])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const params = { page: newPage }

    if (search && search.length > 0) {
      router.push(webRoute('department.index', { ...params, search }))
    } else {
      router.push(webRoute('department.index', params))
    }
  }

  const onSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    router.push(webRoute('department.index', { search: newSearch, page }))
  }

  const onReset = () => {
    setSearch('')
    setPage(1)
    router.push(webRoute('department.index'))
  }

  return (
    <div className="container py-12">
      <Heading title="Nos départements" />

      {departments &&
        departments.meta.links &&
        departments.meta.links.length > 2 && (
          <div className="mb-5 flex justify-between items-start">
            <SearchInput
              onSearch={onSearchChange}
              onReset={onReset}
              lengthData={departments.meta.total}
              placeholder="Rechercher un département"
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {departments?.data.map((department) => (
              <DepartmentWelcomeItem dept={department} key={department.id} />
            ))}
          </div>

          {departments && (
            <div className="mt-8">
              <Pagination onPage={handlePageChange} meta={departments.meta} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
