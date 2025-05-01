'use client'

import { SectionPageTitle } from '@/components/shared/section-page'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchQuery } from '@/hooks/use-fetch'
import { apiRoute } from '@/lib/route'
import { OptionCollection } from '@/types/collection'

export const OptionWelcome = () => {
  const { data: responseData, isLoading } = useFetchQuery<{
    data: OptionCollection[]
  }>(apiRoute('option.index', { limit: 10 }))

  return (
    <div className="container my-12">
      <SectionPageTitle title="Nos Filières">
 De la formation technique aux filières scientifiques et sociales, nous offrons un large éventail de parcours adaptés aux besoins du marché et aux aspirations des étudiants.
      </SectionPageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {isLoading ? (
          <OptionWelcomeSkeleton />
        ) : (
          responseData?.data.map((option) => {
            return (
              <Card className="hover:border-primary" key={option.id}>
                <CardHeader>
                  <CardTitle>{option.name}</CardTitle>
                </CardHeader>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

const OptionWelcomeSkeleton = () => {
  return <Skeleton></Skeleton>
}
