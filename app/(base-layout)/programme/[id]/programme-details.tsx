import { Clock, Tag, Info, FileText } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { webRoute } from '@/lib/route'
import { formatDate } from '@/lib/utils'
import { Programme } from '#/model'

interface ProgrammeDetailsProps {
  programme: Programme
}

export function ProgrammeDetails({ programme }: ProgrammeDetailsProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {programme.name}
              </CardTitle>
              <CardDescription className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">Programme #{programme.id}</Badge>
                <Badge variant="secondary">{programme.alias}</Badge>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={webRoute('programme.index')}>
                  Tous les programmes
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              Informations du programme
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Nom complet
                </h4>
                <p>{programme.name}</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Alias
                </h4>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <p>{programme.alias}</p>
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
                  ID du programme
                </h4>
                <p>{programme.id}</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Date de création
                </h4>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p>{formatDate(programme.created_at)}</p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Dernière mise à jour
                </h4>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p>{formatDate(programme.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
