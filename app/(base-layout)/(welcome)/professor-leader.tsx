'use client'

import { SectionPageTitle } from '@/components/shared/section-page'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchQuery } from '@/hooks/use-fetch'
import { apiRoute } from '@/lib/route'
import type { Professor } from '@/types/model'
import { Calendar, GraduationCap, MapPin, User } from 'lucide-react'
import Image from 'next/image'

export const ProfessorLeaders = () => {
  const { data: responseData, isLoading } = useFetchQuery<{
    data: Professor[]
  }>(apiRoute('professor.leader', { limit: 10 }))

  return (
    <div className="container my-12">
      <SectionPageTitle title="Nos dirigeants">
        Découvrez les responsables académiques et administratifs qui pilotent la
        Faculté de Polytechnique au quotidien.
      </SectionPageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {isLoading ? (
          <ProfessorLeaderSkeleton />
        ) : (
          responseData?.data.map((professor) => {
            return (
              <Card
                className="p-2 hover:border-primary hover:shadow-md transition-all duration-300 overflow-hidden"
                key={professor.id}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/3 h-60">
                    <Image
                      src={
                       `https://ui-avatars.com/api/?name=${encodeURIComponent(professor.firstname + " " + professor.name)}&background=0D8ABC&color=fff&size=256`
                      }
                      alt={`${professor.firstname} ${professor.name}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {professor.grade}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-xl font-bold">
                        {professor.firstname} {professor.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {professor.gender}
                        </span>
                      </div>

                      {professor.birth && (
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {new Date(professor.birth).toLocaleDateString(
                              'fr-FR',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                      )}

                      {professor.department && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Département: {professor.department.name}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center text-sm pt-2">
                        <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium text-primary">
                          {professor.grade}
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

const ProfessorLeaderSkeleton = () => {
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
