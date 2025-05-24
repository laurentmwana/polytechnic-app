import { LaboratoryFees } from '#/model'
import { Heading } from '@/components/shared/heading'
import { apiRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { FeesDetails } from '@/features/fees/details'

export default async function LaboratoryFeesShow({
  params,
}: {
  params: Promise<{ id: string | number }>
}) {
  const { id } = await params

  const response = await fetch(apiRoute('laboratory-fees.show', { id }), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du département')
  }

  const { data: fees } = (await response.json()) as { data: LaboratoryFees }

  if (!fees) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur un frais de laboratoire" />
        <div className="text-center py-12">
          Aucun frais de laboratoire trouvé
        </div>
      </main>
    )
  }

  return (
    <main className="container py-12">
      <Heading title="En savoir plus sur un frais de laboratoire" />

      <div className="mb-5">
        <CustomBreadcrumbs
          items={[
            {
              href: webRoute('laboratory-fees.index'),
              label: 'frais de laboratoires',
            },
            {
              href: webRoute('laboratory-fees.show', { id }),
              label: `frais de laboratoire #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      <FeesDetails fees={fees} />
    </main>
  )
}
