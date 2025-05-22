import { BreadcrumbsHeader } from '@/components/sidebar/breadcrumb-header'
import { webRoute } from '@/lib/route'

const items = [
  {
    title: 'Tableau de bord',
    href: webRoute('dashboard'),
  },

  {
    title: 'Options',
    href: webRoute('~option.index'),P
  },

  {
    title: 'Création',
    href: '#',
  },
]

export default function Page() {
  const onSubmit = () => {}

  return (
    <>
      <BreadcrumbsHeader items={items} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-5 md:min-h-min"></div>
          </div>
        </div>
      </div>
    </>
  )
}
