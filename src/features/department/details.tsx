'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarDays, BookOpen, Building2 } from 'lucide-react'
import { Department } from '#/model'

interface DepartmentDetailProps {
  department: Department
}

export const DepartmentDetail = ({ department }: DepartmentDetailProps) => {
  const [activeTab, setActiveTab] = useState('overview')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  return (
    <div className="space-y-8">
      <Card className="border-t-2">
        <CardHeader>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Building2 className="h-4 w-4" />
            <span>Faculté: {department.faculty.name}</span>
          </div>
          <CardTitle className="text-2xl md:text-3xl">
            {department.name}
          </CardTitle>
          <CardDescription className="text-base">
            {department.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t pt-4 text-sm text-muted-foreground flex flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>Créé le: {formatDate(department.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>Mis à jour le: {formatDate(department.updated_at)}</span>
          </div>
        </CardFooter>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Vue d&#39;ensemble</TabsTrigger>
          <TabsTrigger value="options">
            Options ({department.options.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Faculté
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg">
                {department.faculty.name}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {department.faculty.description}
              </p>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Résumé des options disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {department.options.map((option) => (
                <Card key={option.id} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base">{option.name}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="options" className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            {department.options.map((option) => (
              <AccordionItem key={option.id} value={`option-${option.id}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-medium">{option.name}</h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 pb-2">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground mb-6">
                      {option.description}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  )
}
