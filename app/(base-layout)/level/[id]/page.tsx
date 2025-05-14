import type { Level } from '#/model'
import { Heading } from '@/components/shared/heading'
import { fetchJson } from '@/lib/fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { LevelDetails } from './level-details'

export default async function LevelShow({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetchJson<{ data: Level }>(
    apiLocalRoute('level.show', { id })
  )

  const level = response.data

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

      <LevelDetails level={level.data} />
    </main>
  )
}
