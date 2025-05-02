"use client"

import { SectionPageTitle } from "@/components/shared/section-page"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetchQuery } from "@/hooks/use-fetch"
import { apiRoute } from "@/lib/route"
import type { Department } from "@/types/model"

export const DepartmentWelcome = () => {
  const { data: responseData, isLoading } = useFetchQuery<{
    data: Department[]
  }>(apiRoute("department.index", { limit: 6 }))

  return (
    <div className="container my-12">
      <SectionPageTitle title="Nos Départments">
        Nous regroupons plusieurs départements dynamiques, chacun dédié à un domaine d&#39;expertise précis. Ensemble, ils
        forment un pôle de compétences solide pour répondre aux défis actuels.
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
  return (
    <>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </CardHeader>
          </Card>
        ))}
    </>
  )
}
