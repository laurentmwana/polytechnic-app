'use client'

import { SectionPageTitle } from '@/components/shared/section-page'
import { useFetch } from '@/hooks/use-fetch'
import { apiLocalRoute } from '@/lib/route'
import type { Year } from '#/model'
import { YearDetails } from '@/features/year/details'
import { Calendar, Clock } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const YearAcademicWelcome = () => {
  const response = useFetch<{ data: Year }>(apiLocalRoute('year.pending'))

  const year = response.result

  return (
    <div className="container my-12">
      <SectionPageTitle title="Année académique">
        Une nouvelle année académique, une nouvelle aventure d’apprentissage et
        de découvertes. Ensemble, construisons votre avenir, un semestre à la
        fois.
      </SectionPageTitle>

      {response.isLoading ? (
        <YearAcademicWelcomeSkeleton />
      ) : year ? (
        <YearDetails year={year?.data} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Pas d&lsquo;année académique pour l&#39;instant
        </p>
      )}
    </div>
  )
}

export function YearAcademicWelcomeSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              {/* Title skeleton */}
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />

              <CardDescription className="mt-2 flex flex-wrap gap-2">
                {/* Badge skeletons */}
                <Badge
                  variant="outline"
                  className="bg-gray-200 dark:bg-gray-700 text-transparent animate-pulse"
                >
                  Placeholder
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gray-200 dark:bg-gray-700 text-transparent animate-pulse"
                >
                  Placeholder
                </Badge>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {/* Button skeleton */}
              <div className="h-9 w-36 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            {/* Section title skeleton */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Start date skeleton */}
              <div className="border rounded-lg p-4">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </div>
              </div>
              {/* End date skeleton */}
              <div className="border rounded-lg p-4">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Section title skeleton */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-6 w-56 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Status skeleton */}
              <div className="border rounded-lg p-4">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </div>
              </div>
              {/* Creation date skeleton */}
              <div className="border rounded-lg p-4">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse" />
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </div>
              </div>
              {/* Last update skeleton */}
              <div className="border rounded-lg p-4">
                <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse" />
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse" />
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </CardFooter>
      </Card>
    </div>
  )
}
