'use client'

import { Heading } from '@/components/shared/heading'
import { Pagination } from '@/components/ui/pagination'
import { fetchJson } from '@/lib/fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
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
    Number.parseInt(searchParams.get('page') || '1') || 1
  )
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [departments, setDepartments] = useState<DepartmentMetaData>()

  useEffect(() => {
    setIsLoading(true)

    const getDepartments = async () => {
      try {
        const response = await fetchJson<DepartmentMetaData>(
          apiLocalRoute('department.index', { page, search })
        )

        if (response.status !== 200) {
          throw new Error(
            "Une erreur est survenue lors de l'affichage des départements"
          )
        }

        setDepartments(response.data)
      } catch (error) {
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
              placeholder="Rechercher un départment"
            />
          </div>
        )}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <DepartmentWelcomeSkeleton />
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
