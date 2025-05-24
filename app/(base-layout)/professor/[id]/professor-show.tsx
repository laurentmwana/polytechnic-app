'use client'

import type { Professor } from '#/model'
import { Heading } from '@/components/shared/heading'
import { apiRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProfessorDetails } from '@/features/professor/details'

export function ProfessorInfoShow({ id }: { id: string | number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [professor, setProfessor] = useState<Professor | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const fetchOption = async () => {
      try {
        const response = await fetch(apiRoute('professor.show', { id }), {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de le professeur')
        }

        const { data } = await response.json()
        setProfessor(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchOption()
  }, [id])

  if (loading) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur une Option" />
        <div className="text-center py-12">Chargement...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur un professeur" />
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

  if (!professor) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur un professeur" />
        <div className="text-center py-12">Aucune professeur trouvé</div>
      </main>
    )
  }

  return (
    <main className="container py-12">
      <Heading title="En savoir plus sur un professeur" />

      <div className="mb-5">
        <CustomBreadcrumbs
          items={[
            {
              href: webRoute('professor.index'),
              label: 'Liste de professeurs',
            },
            {
              href: webRoute('professor.show', { id }),
              label: `Professeur #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      <ProfessorDetails professor={professor} />
    </main>
  )
}
