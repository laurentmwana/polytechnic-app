import { Option } from '#/model'
import { BreadcrumbsHeader } from '@/components/sidebar/breadcrumb-header'
import { OptionDetails } from '@/features/option/option-details'
import { fetchJson } from '@/lib/fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'

const items = [
  {
    title: 'Tableau de bord',
    href: webRoute('dashboard'),
  },

  {
    title: 'Options',
    href: webRoute('~option.index'),
  },

  {
    title: 'En savoir plus sur une option',
    href: '#optionId',
  },
]

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetchJson<{ data: Option }>(
    apiLocalRoute('option.show', { id })
  )

  const option = response.data

  return (
    <>
      <BreadcrumbsHeader items={items} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-5 md:min-h-min">
              <OptionDetails option={option.data} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
