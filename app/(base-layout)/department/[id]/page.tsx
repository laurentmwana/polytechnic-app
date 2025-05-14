import { Department } from '#/model'
import { Heading } from '@/components/shared/heading'
import { fetchJson } from '@/lib/fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
import { DepartmentDetail } from './department-details'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'

export default async function DepartmentShow({params}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetchJson<{ data: Department }>(
    apiLocalRoute('department.show', { id })
  )

  const departments = response.data

  return (
    <main className="container py-12">
      <Heading title="En savoir plus sur un département" />

      <div className="mb-5">
        <CustomBreadcrumbs
          items={[
            {
              href: webRoute('department.index'),
              label: 'Départements',
            },
            {
              href: webRoute('department.show', { id }),
              label: `département #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>
      <DepartmentDetail department={departments.data} />
    </main>
  )
}
