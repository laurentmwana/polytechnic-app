'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, GraduationCap, Clock, FileText, School } from 'lucide-react'
import { Deliberation } from '#/model'
import { formatDate } from '@/lib/utils'

interface DeliberationDetailsProps {
  deliberation: Deliberation
}

export function DeliberationDetails({
  deliberation,
}: DeliberationDetailsProps) {
  const getProgrammeColor = (programmeGroup: string) => {
    return programmeGroup === 'nouveau système' ? 'default' : 'secondary'
  }

  return (
    <div className="space-y-6">
      {/* Carte principale */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl font-bold">
                  Délibération #{deliberation.id}
                </CardTitle>
                <Badge
                  variant={getProgrammeColor(
                    deliberation.level.programme.programme_group
                  )}
                >
                  {deliberation.level.programme.programme_group}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Créée le {formatDate(deliberation.created_at)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations du programme */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <School className="h-5 w-5 mr-2 text-primary" />
                  Programme d&#39;études
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Programme:</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {deliberation.level.programme.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ({deliberation.level.programme.alias})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">ID Programme:</span>
                    <span className="font-mono text-sm">
                      {deliberation.level.programme.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">ID Niveau:</span>
                    <span className="font-mono text-sm">
                      {deliberation.level.id}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  Option d&#39;études
                </h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="font-semibold text-lg mb-1">
                      {deliberation.level.option.name}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Alias: {deliberation.level.option.alias}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {deliberation.level.option.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations temporelles */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Période académique
                </h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {deliberation.year.start} - {deliberation.year.end}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Année académique (ID: {deliberation.year.id})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Début de délibération:
                    </span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatDate(deliberation.start_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Description
                </h3>
                <div className="p-4 border rounded-lg min-h-[100px]">
                  {deliberation.description ? (
                    <p className="text-sm leading-relaxed">
                      {deliberation.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic text-sm">
                      Aucune description disponible pour cette délibération.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Métadonnées</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Créée le:</span>
                    <span>{formatDate(deliberation.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modifiée le:</span>
                    <span>{formatDate(deliberation.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
