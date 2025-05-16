'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, GraduationCap, School } from 'lucide-react'

import { EmptyDataFetch } from '@/components/no-data'
import { SectionPageTitle } from '@/components/shared/section-page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useFetch } from '@/hooks/use-fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
import { cn, excerpt } from '@/lib/utils'
import { Option } from '#/model'

export const OptionWelcome = () => {
  const [expandedOption, setExpandedOption] = useState<number | null>(null)

  const response = useFetch<{ data: Option[] }>(
    apiLocalRoute('option.index', { limit: 10 })
  )

  const toggleExpand = (optionId: number) => {
    setExpandedOption(expandedOption === optionId ? null : optionId)
  }

  return (
    <div className="container my-12">
      <SectionPageTitle title="Nos Filières">
        De la formation technique aux filières scientifiques et sociales, nous
        offrons un large éventail de parcours adaptés aux besoins du marché et
        aux aspirations des étudiants.
      </SectionPageTitle>

      {response.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <OptionWelcomeSkeleton />
        </div>
      ) : response.result && response.result.data.length > 0 ? (
        <>
          {/* Onglets de filtrage par programme */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {response.result.data.map((option) => (
              <Card
                key={option.id}
                className={cn(
                  'transition-all duration-300 hover:border-primary',
                  expandedOption === option.id ? 'border-primary' : ''
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      {excerpt(option.name, 40)}
                    </CardTitle>
                    <Badge variant="outline" className="ml-2">
                      {option.levels?.length || 0} promotion(s)
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {option.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  {option.levels && option.levels.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {option.levels.slice(0, 3).map((level) => (
                        <TooltipProvider key={level.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="cursor-help"
                              >
                                {level.programme.alias || level.programme.name}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{level.programme.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                      {option.levels.length > 3 && (
                        <Badge variant="outline">
                          +{option.levels.length - 3}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Aucune promotion disponible
                    </p>
                  )}
                </CardContent>

                {expandedOption === option.id &&
                  option.levels &&
                  option.levels.length > 0 && (
                    <CardContent className="pt-0 border-t">
                      <div className="mt-3">
                        <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                          <GraduationCap className="h-4 w-4" />
                          Programmes disponibles
                        </h4>
                        <ul className="space-y-2">
                          {option.levels.map((level) => (
                            <li
                              key={level.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              <School className="h-4 w-4 text-muted-foreground" />
                              <span>{level.programme.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({level.programme.alias})
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({level.programme.programme_group})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}

                <CardFooter className="flex justify-between pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(option.id)}
                    className="text-xs"
                  >
                    {expandedOption === option.id ? 'Réduire' : 'Voir plus'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    asChild
                  >
                    <Link href={webRoute('option.show', { id: option.id })}>
                      Détails
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <EmptyDataFetch message="Aucune filière disponible pour le moment" />
      )}
    </div>
  )
}

export const OptionWelcomeSkeleton = () => {
  return (
    <>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
    </>
  )
}
