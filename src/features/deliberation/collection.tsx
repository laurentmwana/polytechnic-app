'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, GraduationCap, Search, Eye } from 'lucide-react'
import { Deliberation } from '#/model'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { webRoute } from '@/lib/route'

interface DeliberationsCollectionProps {
  deliberations: Deliberation[]
}

export function DeliberationsCollection({
  deliberations,
}: DeliberationsCollectionProps) {
  const getProgrammeColor = (programmeGroup: string) => {
    return programmeGroup === 'nouveau système' ? 'default' : 'secondary'
  }

  return (
    <div className="space-y-6">
      {/* Grille des délibérations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliberations.map((deliberation) => (
          <Card
            key={deliberation.id}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">
                    {deliberation.level.programme.alias}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {deliberation.level.programme.name}
                  </p>
                </div>
                <Badge
                  variant={getProgrammeColor(
                    deliberation.level.programme.programme_group
                  )}
                >
                  {deliberation.level.programme.programme_group}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">Option:</span>
                  <span className="ml-1 text-muted-foreground truncate">
                    {deliberation.level.option.alias}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">Année:</span>
                  <span className="ml-1 text-muted-foreground">
                    {deliberation.year.start}-{deliberation.year.end}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="font-medium">Début:</span>
                  <span className="ml-1 text-muted-foreground">
                    {formatDate(deliberation.start_at)}
                  </span>
                </div>
              </div>

              <Button className="w-full" variant="outline" asChild>
                <Link
                  href={webRoute('deliberation.show', { id: deliberation.id })}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir les détails
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucune délibération trouvée */}
      {deliberations.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Aucune délibération trouvée
          </h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche ou vos filtres.
          </p>
        </div>
      )}
    </div>
  )
}
