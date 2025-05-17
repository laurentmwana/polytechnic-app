'use client'

import type React from 'react'
import { SectionPageTitle } from '@/components/shared/section-page'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFetch } from '@/hooks/use-fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
import type { Department } from '#/model'
import {
  Building,
  Zap,
  Laptop,
  Cog,
  BookOpen,
  FlaskRoundIcon as Flask,
  Heart,
  Leaf,
  ChevronRight,
  GraduationCap,
} from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { excerpt } from '@/lib/utils'
import { EmptyDataFetch } from '@/components/no-data'

const getIconByName = (name: string): React.ReactNode => {
  const nameLower = name.toLowerCase()

  if (nameLower.includes('civil')) return <Building className="h-5 w-5" />
  if (nameLower.includes('électrique') || nameLower.includes('electrique'))
    return <Zap className="h-5 w-5" />
  if (nameLower.includes('informatique')) return <Laptop className="h-5 w-5" />
  if (nameLower.includes('mécanique') || nameLower.includes('mecanique'))
    return <Cog className="h-5 w-5" />
  if (nameLower.includes('minier')) return <BookOpen className="h-5 w-5" />
  if (nameLower.includes('chimique')) return <Flask className="h-5 w-5" />
  if (nameLower.includes('biomédical') || nameLower.includes('biomedical'))
    return <Heart className="h-5 w-5" />
  if (nameLower.includes('environnement')) return <Leaf className="h-5 w-5" />

  return <GraduationCap className="h-5 w-5" />
}

export const DepartmentWelcome = () => {
  const response = useFetch<{ data: Department[] }>(
    apiLocalRoute('department.index', { limit: 6 })
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return (
    <div className="container my-12">
      <SectionPageTitle title="Nos Départements">
        Nous regroupons plusieurs départements dynamiques, chacun dédié à un
        domaine d&#39;expertise précis. Ensemble, ils forment un pôle de
        compétences solide pour répondre aux défis actuels.
      </SectionPageTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:justify-center">
        {response.isLoading ? (
          // Affichage des skeletons pendant le chargement
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-14" />
                </div>
                <Skeleton className="h-4 w-32" />
              </CardContent>
              <CardFooter className="pt-0">
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : response.result && response.result.data.length > 0 ? (
          response.result.data.map((dept) => {
            return <DepartmentWelcomeItem dept={dept} key={dept.id} />
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <EmptyDataFetch message="Aucun département disponible pour le moment." />
          </div>
        )}
      </div>
    </div>
  )
}

export const DepartmentWelcomeSkeleton = () => {
  return Array.from({ length: 6 }).map((_, index) => (
    <Card key={index} className="border">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5 mb-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="h-4 w-32" />
      </CardContent>
      <CardFooter className="pt-0">
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  ))
}

export const DepartmentWelcomeItem = ({ dept }: { dept: Department }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3 mb-2">
          <div className={`p-2 rounded-md border`}>
            {getIconByName(dept.name)}
          </div>
          <div>
            <CardTitle className="text-lg">{excerpt(dept.name, 80)}</CardTitle>
          </div>
        </div>
        <CardDescription className="mt-2">{dept.description}</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {dept.options.slice(0, 3).map((option, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {excerpt(option.name, 45)}
            </Badge>
          ))}
          {dept.options.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{dept.options.length - 3}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">{dept.options.length}</span> filières
          disponibles
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={webRoute('department.show', { id: dept.id })}>
            En savoir plus
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
