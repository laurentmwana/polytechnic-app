'use client'

import { SectionPageTitle } from '@/components/shared/section-page'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetch } from '@/hooks/use-fetch'
import { apiLocalRoute } from '@/lib/route'
import type { Year } from '#/model'
import { YearDetails } from '@/features/year/details'

export const YearAcademicWelcome = () => {
  const response = useFetch<{ data: Year }>(apiLocalRoute('year.pending'))

  const year = response.result

  if (!year) return null

  return (
    <div className="container my-12">
      <SectionPageTitle title="Année académique" />

        {response.isLoading ? (
          <YearAcademicWelcomeSkeleton />
        ) : (
          <YearDetails year={year?.data} />
        )}
    </div>
  )
}

const YearAcademicWelcomeSkeleton = () => {
  return (
    <>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="w-full overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/3 h-60">
                <Skeleton className="absolute inset-0" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              <div className="flex-1 p-4">
                <div className="pb-3">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex items-center pt-2">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
    </>
  )
}
