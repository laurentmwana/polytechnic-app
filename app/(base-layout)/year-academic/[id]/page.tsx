import type { Year } from '#/model'
import { Heading } from '@/components/shared/heading'
import { fetchJson } from '@/lib/fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { YearDetails } from '@/features/year/details'

export default async function YearShow({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetchJson<{ data: Year }>(
    apiLocalRoute('year.show', { id })
  )

  const year = response.data

  return (
    <main className="container py-12">
      <Heading title="En savoir plus sur une année académique" />

      <div className="mb-5">
        <CustomBreadcrumbs
          items={[
            {
              href: webRoute('year.index'),
              label: 'Année Académique',
            },
            {
              href: webRoute('year.show', { id }),
              label: `Année #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      <YearDetails year={year.data} />
    </main>
  )
}
