import type { Level } from '#/model'
import { Heading } from '@/components/shared/heading'
import { apiRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { LevelDetails } from '@/features/level/level-details'

export default async function LevelShow({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetch(apiRoute('level.show', { id }))

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de la prootion ${id}`)
  }

  const level = ((await response.json()) as { data: Level }).data

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
