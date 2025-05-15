import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  CalendarDays,
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
import Link from 'next/link'
import { webRoute } from '@/lib/route'
import { Year } from '#/model'
import { formatDate } from '@/lib/utils'

interface YearDetailsProps {
  year: Year
}

export function YearDetails({ year }: YearDetailsProps) {
 

  return (
    <div className="space-y-8">
      <Card className={year.is_closed ? 'border-muted' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{year.name}</CardTitle>
              <CardDescription className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">Année #{year.id}</Badge>
                {year.is_closed ? (
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground"
                  >
                    Fermée
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
                    Active
                  </Badge>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={webRoute('year.index')}>Toutes les années</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
              <CalendarDays className="h-5 w-5 text-primary" />
              Période académique
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Date de début
                </h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p>{year.start}</p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Date de fin
                </h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p>{year.end}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-primary" />
              Informations supplémentaires
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Statut
                </h4>
                <div className="flex items-center gap-2">
                  {year.is_closed ? (
                    <>
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Année fermée</p>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <p>Année active</p>
                    </>
                  )}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Date de création
                </h4>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p>{formatDate(year.created_at)}</p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Dernière mise à jour
                </h4>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p>{formatDate(year.updated_at)}</p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  ID de l&#39;année
                </h4>
                <p>{year.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <p className="text-sm text-muted-foreground">
            {year.is_closed
              ? 'Cette année académique est fermée et archivée.'
              : 'Cette année académique est actuellement active.'}{' '}
            Pour plus d&#39;informations, veuillez contacter
            l&lsquo;administration.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
