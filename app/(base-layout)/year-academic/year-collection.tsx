import Link from 'next/link'
import { Calendar, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react'
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
import { webRoute } from '@/lib/route'
import { Year } from '#/model'
import { formatDate } from '@/lib/utils'

interface YearCollectionProps {
  year: Year
}

export function YearCollection({ year }: YearCollectionProps) {
  // Calculer la durée en mois
  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      endDate.getMonth() -
      startDate.getMonth()
    return `${diffMonths} mois`
  }

  return (
    <Card
      className={`flex flex-col h-full ${
        year.is_closed ? 'border-muted bg-muted/20' : ''
      }`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{year.name}</span>
          {year.is_closed ? (
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              Fermée
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Active
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Année académique #{year.id}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Période</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{year.name}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Durée: {getDuration(year.start, year.end)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Statut</h3>
            <div className="flex items-center gap-2">
              {year.is_closed ? (
                <>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Année fermée</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Année active</span>
                </>
              )}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Mis à jour le {formatDate(year.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          asChild
          variant={year.is_closed ? 'outline' : 'default'}
          className="w-full"
        >
          <Link href={webRoute('year.show', { id: year.id })}>
            Voir les détails
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
