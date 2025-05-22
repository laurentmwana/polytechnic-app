'use client'

import { useState, useEffect } from 'react'
import type { Level } from '#/model'
import { Heading } from '@/components/shared/heading'
import { apiRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { LevelDetails } from '@/features/level/level-details'
import { useRouter } from 'next/navigation'

export default function LevelShow({
  params,
}: {
  params: { id: string | number }
}) {
  const router = useRouter()
  const id = Number(params.id)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [level, setLevel] = useState<Level | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const fetchLevel = async () => {
      try {
        const response = await fetch(apiRoute('level.show', { id }))
        if (!response.ok)
          throw new Error('Erreur lors de la récupération de la promotion')
        const data = await response.json()
        setLevel(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchLevel()
  }, [id])

  if (loading) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur une promotion" />
        <div className="text-center py-12">Chargement...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur une promotion" />
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

  if (!level) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur une promotion" />
        <div className="text-center py-12">Aucune promotion trouvée</div>
      </main>
    )
  }

  return (
    <main className="container py-12">
      <Heading title="En savoir plus sur une promotion" />

      <div className="mb-5">
        <CustomBreadcrumbs
          items={[
            {
              href: webRoute('level.index'),
              label: 'Promotions',
            },
            {
              href: webRoute('level.show', { id }),
              label: `Promotion #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      <LevelDetails level={level} />
    </main>
  )
}
