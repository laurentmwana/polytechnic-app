'use client'

import type { Option as OptionModel } from '#/model'
import { Heading } from '@/components/shared/heading'
import { apiRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { OptionDetails } from '@/features/option/option-details'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OptionShow({
  params,
}: {
  params: { id: string | number }
}) {
  const router = useRouter()
  const id = Number(params.id)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [option, setOption] = useState<OptionModel | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const fetchOption = async () => {
      try {
        const response = await fetch(apiRoute('option.show', { id }), {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'option")
        }

        const { data } = await response.json()
        setOption(data)
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
        <Heading title="En savoir plus sur une Option" />
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

  if (!option) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur une Option" />
        <div className="text-center py-12">Aucune option trouvée</div>
      </main>
    )
  }

  return (
    <main className="container py-12">
      <Heading title="En savoir plus sur une Option" />

      <div className="mb-5">
        <CustomBreadcrumbs
          items={[
            {
              href: webRoute('option.index'),
              label: 'Options',
            },
            {
              href: webRoute('option.show', { id }),
              label: `Option #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      <OptionDetails option={option} />
    </main>
  )
}
