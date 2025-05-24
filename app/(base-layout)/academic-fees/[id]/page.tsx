import { AcademicFees } from '#/model'
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

  const response = await fetch(apiRoute('academic-fees.show', { id }), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du frais académique')
  }

  const { data: fees } = (await response.json()) as { data: AcademicFees }

  if (!fees) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur un frais de académique" />
        <div className="text-center py-12">
          Aucun frais de académique trouvé
        </div>
      </main>
    )
  }

  return (
    <main className="container py-12">
      <Heading title="En savoir plus sur un frais de académique" />

      <div className="mb-5">
        <CustomBreadcrumbs
          items={[
            {
              href: webRoute('academic-fees.index'),
              label: 'frais de académiques',
            },
            {
              href: webRoute('academic-fees.show', { id }),
              label: `frais de académique #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      <FeesDetails fees={fees} />
    </main>
  )
}
