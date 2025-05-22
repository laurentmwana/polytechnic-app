'use client'

import { Department } from '#/model'
import { Heading } from '@/components/shared/heading'
import { apiRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { DepartmentDetail } from '@/features/department/details'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DepartmentShow({
  params,
}: {
  params: { id: string | number }
}) {
  const router = useRouter()
  const id = Number(params.id)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [department, setDepartment] = useState<Department | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const fetchDepartment = async () => {
      try {
        const response = await fetch(apiRoute('department.show', { id }), {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du département')
        }

        const { data } = await response.json()
        setDepartment(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchDepartment()
  }, [id])

  if (loading) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur un département" />
        <div className="text-center py-12">Chargement...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur un département" />
        <div className="text-center py-12 text-red-500">
          {error}
          <button
            onClick={() => router.refresh()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Réessayer
          </button>
        </div>
      </main>
    )
  }

  if (!department) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur un département" />
        <div className="text-center py-12">Aucun département trouvé</div>
      </main>
    )
  }

  return (
    <main className="container py-12">
      <Heading title="En savoir plus sur un département" />

      <div className="mb-5">
        <CustomBreadcrumbs
          items={[
            {
              href: webRoute('department.index'),
              label: 'Départements',
            },
            {
              href: webRoute('department.show', { id }),
              label: `Département #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      <DepartmentDetail department={department} />
    </main>
  )
}
