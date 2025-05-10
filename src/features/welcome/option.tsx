'use client'

import { Option } from '#/model'
import { EmptyDataFetch } from '@/components/no-data'
import { SectionPageTitle } from '@/components/shared/section-page'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetch } from '@/hooks/use-fetch'
import { apiRoute } from '@/lib/route'

export const OptionWelcome = () => {
  const response = useFetch<Option[]>(apiRoute('option.index', { limit: 10 }))

  return (
    <div className="container my-12">
      <SectionPageTitle title="Nos Filières">
        De la formation technique aux filières scientifiques et sociales, nous
        offrons un large éventail de parcours adaptés aux besoins du marché et
        aux aspirations des étudiants.
      </SectionPageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {response.isLoading ? (
          <OptionWelcomeSkeleton />
        ) : response.data ? (
          response.data.map((o) => {
            return (
              <Card className="hover:border-primary" key={o.id}>
                <CardHeader>
                  <CardTitle>{o.name}</CardTitle>
                </CardHeader>
              </Card>
            )
          })
        ) : (
          <EmptyDataFetch message="Pas de données" />
        )}
      </div>
    </div>
  )
}

const OptionWelcomeSkeleton = () => {
  return (
    <>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
          </Card>
        ))}
    </>
  )
}
