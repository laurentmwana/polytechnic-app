'use client'

import { useState, useEffect } from 'react'
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
import { apiRoute, webRoute } from '@/lib/route'
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

const getIconByName = (name: string) => {
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
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(
          apiRoute('department.index', { limit: 6 }),
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
          }
        )
        if (!response.ok)
          throw new Error('Erreur lors de la récupération des départements')
        const data = await response.json()
        setDepartments(data.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDepartments()
  }, [])

  if (error) {
    console.error(error)
    return (
      <div className="container my-12">
        <SectionPageTitle title="Nos Départements">
          Nous regroupons plusieurs départements dynamiques, chacun dédié à un
          domaine d&#39;expertise précis.
        </SectionPageTitle>
        <div className="col-span-full text-center py-8">
          <EmptyDataFetch message="Erreur lors du chargement des départements." />
        </div>
      </div>
    )
  }

  return (
    <div className="container my-12">
      <SectionPageTitle title="Nos Départements">
        Nous regroupons plusieurs départements dynamiques, chacun dédié à un
        domaine d&#39;expertise précis. Ensemble, ils forment un pôle de
        compétences solide pour répondre aux défis actuels.
      </SectionPageTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-centers">
        {isLoading ? (
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
        ) : departments.length > 0 ? (
          departments.map((dept) => {
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
        <div className="flex flex-wrap gap=1.5 mb-2">
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
