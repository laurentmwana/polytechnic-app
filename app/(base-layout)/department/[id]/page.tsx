import { Department } from '#/model'
import { Heading } from '@/components/shared/heading'
import { apiRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { DepartmentDetail } from '@/features/department/details'

export default async function DepartmentShow({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetch(apiRoute('department.show', { id }))

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du département ${id}`)
  }

  const department = ((await response.json()) as { data: Department }).data

  if (!department) {
    return (
      <main className="container py-12">
        <Heading title="En savoir plus sur un département" />
        <div className="text-center py-12">Aucun département trouvé</div>
      </main>
    )
  }

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
              label: `Département #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      <DepartmentDetail department={department} />
    </main>
  )
}
