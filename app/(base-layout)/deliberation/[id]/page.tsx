import { Deliberation } from '#/model'
import { Heading } from '@/components/shared/heading'
import { apiRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { DeliberationDetails } from '@/features/deliberation/details'

export default async function DeliberationShow({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetch(apiRoute('deliberation.show', { id }), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la délibération')
  }

  const { data: deliberation } = (await response.json()) as {
    data: Deliberation
  }

  if (!deliberation) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur une délibération" />
        <div className="text-center py-12">Aucune délibération trouvée</div>
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
              href: webRoute('deliberation.index'),
              label: 'délibérations',
            },
            {
              href: webRoute('deliberation.show', { id }),
              label: `délibération #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      <DeliberationDetails deliberation={deliberation} />
    </main>
  )
}
