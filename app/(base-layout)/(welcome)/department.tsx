'use client'

import { SectionPageTitle } from '@/components/shared/section-page'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchQuery } from '@/hooks/use-fetch'
import { apiRoute } from '@/lib/route'
import { Department } from '@/types/model'

export const DepartmentWelcome = () => {
  const { data: responseData, isLoading } = useFetchQuery<{
    data: Department[]
  }>(apiRoute('department.index', { limit: 6 }))

  return (
    <div className="container my-12">
      <SectionPageTitle title="Nos Départments">
        Nous regroupons plusieurs départements dynamiques, chacun dédié à un domaine d’expertise précis. Ensemble, ils forment un pôle de compétences solide pour répondre aux défis actuels.
      </SectionPageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {isLoading ? (
          <DepartmentWelcomeSkeleton />
        ) : (
          responseData?.data.map((department) => {
            return (
              <Card className="hover:border-primary" key={department.id}>
                <CardHeader>
                  <CardTitle>{department.name}</CardTitle>
                  <CardDescription>{department.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

const DepartmentWelcomeSkeleton = () => {
  return <Skeleton></Skeleton>
}
