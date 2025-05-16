'use client'

import { DepartmentMetaData } from '#/model'
import { TextLink } from '@/components/shared/text-link'
import { BreadcrumbsHeader } from '@/components/sidebar/breadcrumb-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { SearchInput } from '@/components/ui/search-input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from '@/components/ui/table'
import { AdminLayout } from '@/layouts/admin-layout'
import { ago } from '@/lib/date-time'
import { apiLocalRoute, webRoute } from '@/lib/route'
import { excerpt } from '@/lib/utils'
import { Eye, Pen } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const items = [
  {
    title: 'Tableau de bord',
    href: webRoute('dashboard'),
  },
  {
    title: 'Départements',
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
  const [departments, setDepartments] = useState<DepartmentMetaData>()

  useEffect(() => {
    setIsLoading(true)

    const getDepartments = async () => {
      try {
        const response = await fetch(
          apiLocalRoute('~department.index', { page, search })
        )

        if (response.status !== 200) {
          throw new Error(
            "Une erreur est survenue lors de l'affichage des départements"
          )
        }

        const data = (await response.json()) as DepartmentMetaData

        setDepartments(data)
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
      router.push(webRoute('~department.index', { ...params, search }))
    } else {
      router.push(webRoute('~department.index', params))
    }
  }

  const onSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    router.push(webRoute('~department.index', { search: newSearch, page }))
  }

  const onReset = () => {
    setSearch('')
    setPage(1)
    router.push(webRoute('~department.index'))
  }

  return (
    <>
      <BreadcrumbsHeader items={items} />
      <AdminLayout>
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
          <div className="w-full mt-8">
            <TableSkeleton className="w-full" />
          </div>
        ) : (
          <>
            {departments && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Créer</TableHead>
                    <TableHead className="lg:text-end">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {departments.data.map((department) => {
                    return (
                      <TableRow key={department.id}>
                        <TableCell>
                          <TextLink
                            href={webRoute('~department.show', {
                              id: department.id,
                            })}
                          >
                            {excerpt(department.name, 40)}
                          </TextLink>
                        </TableCell>

                        <TableCell>
                          <Badge variant="secondary">
                            {department.options.length}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <p className="text-xs text-muted-foreground">
                            {ago(department.created_at)}
                          </p>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3 justify-end">
                            <Button variant="secondary" size="sm" asChild>
                              <Link
                                href={webRoute('~department.edit', {
                                  id: department.id,
                                })}
                              >
                                <Pen />
                              </Link>
                            </Button>

                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={webRoute('~department.show', {
                                  id: department.id,
                                })}
                              >
                                <Eye />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}

            {departments && (
              <div className="mt-8">
                <Pagination onPage={handlePageChange} meta={departments.meta} />
              </div>
            )}
          </>
        )}
      </AdminLayout>
    </>
  )
}
