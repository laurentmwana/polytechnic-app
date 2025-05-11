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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useFetch } from '@/hooks/use-fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
import { cn, excerpt } from '@/lib/utils'
import { Programme, Option } from '#/model'

export const OptionWelcome = () => {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [expandedOption, setExpandedOption] = useState<number | null>(null)

  const response = useFetch<{ data: Option[] }>(
    apiLocalRoute('option.index', { limit: 10 })
  )

  // Fonction pour extraire les programmes uniques de toutes les options
  const getUniquePrograms = (options: Option[]): Programme[] => {
    const programsMap = new Map<number, Programme>()

    options.forEach((option) => {
      option.levels?.forEach((level) => {
        if (level.programme && !programsMap.has(level.programme.id)) {
          programsMap.set(level.programme.id, level.programme)
        }
      })
    })

    return Array.from(programsMap.values())
  }

  // Filtrer les options en fonction de l'onglet actif
  const filterOptions = (options: Option[], programId: string): Option[] => {
    if (programId === 'all') return options

    return options.filter((option) =>
      option.levels?.some(
        (level) => level.programme?.id.toString() === programId
      )
    )
  }

  // Gérer l'expansion/réduction d'une option
  const toggleExpand = (optionId: number) => {
    setExpandedOption(expandedOption === optionId ? null : optionId)
  }

  // Obtenir les programmes uniques si les données sont disponibles
  const uniquePrograms = response.result
    ? getUniquePrograms(response.result.data)
    : []

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
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <TabsList className="w-full max-w-3xl mx-auto flex flex-wrap h-auto p-1 mb-2 gap-y-3">
              <TabsTrigger value="all" className="flex-grow">
                Toutes les filières
              </TabsTrigger>
              {uniquePrograms.map((program) => (
                <TabsTrigger
                  key={program.id}
                  value={program.id.toString()}
                  className="flex-grow"
                >
                  {program.alias || program.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Contenu pour tous les onglets */}
            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filterOptions(response.result.data, activeTab).map(
                  (option) => (
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
                                      {level.programme.alias ||
                                        level.programme.name}
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
                          {expandedOption === option.id
                            ? 'Réduire'
                            : 'Voir plus'}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          asChild
                        >
                          <Link
                            href={webRoute('option.show', { id: option.id })}
                          >
                            Détails
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
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
