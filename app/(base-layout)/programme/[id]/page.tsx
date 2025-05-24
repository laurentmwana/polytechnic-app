import type { Programme } from '#/model'
import { Heading } from '@/components/shared/heading'
import { apiRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { ProgrammeDetails } from './programme-details'

export default async function ProgrammeShow({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetch(apiRoute('programme.show', { id }))

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du programme ${id}`)
  }

  const programme = ((await response.json()) as { data: Programme }).data

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

      <ProgrammeDetails programme={programme} />
    </main>
  )
}
