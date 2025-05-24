import type { Option as OptionModel } from '#/model'
import { Heading } from '@/components/shared/heading'
import { apiRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { OptionDetails } from '@/features/option/option-details'

export default async function OptionShow({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetch(apiRoute('option.show', { id }))

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de l'option ${id}`)
  }

  const option = ((await response.json()) as { data: OptionModel }).data

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
