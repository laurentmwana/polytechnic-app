import type { Programme } from '#/model'
import { Heading } from '@/components/shared/heading'
import { fetchJson } from '@/lib/fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { ProgrammeDetails } from './programme-details'

export default async function ProgrammeShow({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetchJson<{ data: Programme }>(
    apiLocalRoute('programme.show', { id })
  )

  const programme = response.data

  return (
    <main className="container py-12">
      <Heading title="En savoir plus sur une Option" />

      <div className="mb-5">
        <CustomBreadcrumbs
          items={[
            {
              href: webRoute('programme.index'),
              label: 'Programmes',
            },
            {
              href: webRoute('programme.show', { id }),
              label: `Programme #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      <ProgrammeDetails programme={programme.data} />
    </main>
  )
}
