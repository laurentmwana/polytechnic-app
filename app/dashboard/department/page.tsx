'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { BreadcrumbsHeader } from '@/components/sidebar/breadcrumb-header'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { AdminLayout } from '@/layouts/admin-layout'
import { apiRoute, webRoute } from '@/lib/route'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Department } from '#/model'

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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [departments, setDepartments] = useState<{ data: Department[] }>({
    data: [],
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepartments = useCallback(async () => {
    if (!session?.user?.accessToken) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(apiRoute('~department.index'), {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des départements')
      }

      const data = await response.json()
      setDepartments(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Une erreur inconnue est survenue'
      )
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.accessToken])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(webRoute('login'))
      return
    }

    if (status === 'authenticated') {
      fetchDepartments()
    }
  }, [status, fetchDepartments, router])

  return (
    <>
      <BreadcrumbsHeader items={items} />
      <AdminLayout>
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div>
            <div className="mb-4 flex items-center gap-4 justify-between">
              <SearchInput
                lengthData={departments.data.length}
                
              />
              <Link href="" passHref>
                <Button size="sm" variant="secondary" asChild>
                  <a className="flex items-center gap-2">
                    <Plus size={15} />
                    <span className="sr-only">Ajouter un département</span>
                  </a>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}
