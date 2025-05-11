import type { Option as OptionModel } from '#/model'
import { Heading } from '@/components/shared/heading'
import { fetchJson } from '@/lib/fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { OptionDetails } from './option-details'

export default async function OptionShow({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetchJson<{ data: OptionModel }>(
    apiLocalRoute('option.show', { id })
  )

  const option = response.data

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

      <OptionDetails option={option.data} />
    </main>
  )
}
