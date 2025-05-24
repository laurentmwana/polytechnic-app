import {
  Calendar,
  GraduationCap,
  BookOpen,
  Clock,
  Tag,
  Layers,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { webRoute } from '@/lib/route'
import { formatDate } from '@/lib/utils'
import { Level } from '#/model'

interface LevelDetailsProps {
  level: Level
}

export function LevelDetails({ level }: LevelDetailsProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {level.programme.name}
              </CardTitle>
              <CardDescription className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">Niveau #{level.id}</Badge>
                <Badge variant="secondary">{level.programme.alias}</Badge>
                <Badge>{level.programme.programme_group}</Badge>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={webRoute('level.index')}>Tous les niveaux</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Option associée
                </h3>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {level.option.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {level.option.description ||
                        'Aucune description disponible pour cette option.'}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 border-t">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={webRoute('option.show', { id: level.option.id })}
                      >
                        Voir les détails de l&#39;option
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Programme
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Nom du programme
                    </h4>
                    <p>{level.programme.name}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Alias
                    </h4>
                    <p>{level.programme.alias}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Groupe de programme
                    </h4>
                    <p>{level.programme.programme_group}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      ID du programme
                    </h4>
                    <p>{level.programme.id}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={webRoute('programme.show', {
                        id: level.programme.id,
                      })}
                    >
                      Voir les détails du programme
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <Layers className="h-5 w-5 text-primary" />
                  Informations détaillées
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      ID du niveau
                    </h4>
                    <p>{level.id}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Date de création
                    </h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p>{formatDate(level.created_at)}</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Dernière mise à jour
                    </h4>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p>{formatDate(level.updated_at)}</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Programme associé
                    </h4>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <p>{level.programme.alias}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
