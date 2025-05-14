'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, GraduationCap, BookOpen, Layers } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { webRoute } from '@/lib/route'
import { Option as OptionModel } from '#/model'

interface OptionDetailsProps {
  option: OptionModel
}

export function OptionDetails({ option }: OptionDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {option.name}
              </CardTitle>
              <CardDescription className="mt-2">
                <Badge variant="outline" className="mr-2">
                  Option #{option.id}
                </Badge>
                <Badge variant="secondary">
                  {option.levels.length} promotion disponibles
                </Badge>
              </CardDescription>
            </div>
            <Link href={webRoute('option.index')}>
              <Button variant="outline" size="sm">
                Toutes les options
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="levels">Promotion</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Description
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {option.description ||
                      'Aucune description disponible pour cette option.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Aperçu des promotions
                  </h3>
                  <ul className="mt-2 grid gap-2">
                    {option.levels.slice(0, 3).map((level) => (
                      <li key={level.id} className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                        >
                          {level.id}
                        </Badge>
                        <span>{level.programme.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {level.programme.alias}
                        </Badge>
                      </li>
                    ))}
                    {option.levels.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => setActiveTab('levels')}
                      >
                        Voir toutes les promotions ({option.levels.length})
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="levels" className="mt-6">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Toutes les promotions disponibles
                </h3>

                <Accordion type="single" collapsible className="w-full">
                  {option.levels.map((level) => (
                    <AccordionItem key={level.id} value={`level-${level.id}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <Badge
                            variant="outline"
                            className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                          >
                            {level.id}
                          </Badge>
                          <span>{level.programme.name}</span>
                          <Badge variant="secondary" className="ml-2">
                            {level.programme.alias}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-9 pt-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">
                                ID du programme
                              </h4>
                              <p>{level.programme.id}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Alias
                              </h4>
                              <p>{level.programme.alias}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button variant="outline" size="sm">
                              Voir les détails du programme
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {option.levels.length === 0 && (
                  <div className="text-center py-8 border rounded-md">
                    <p className="text-muted-foreground">
                      Aucune promotion disponible pour cette option
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
