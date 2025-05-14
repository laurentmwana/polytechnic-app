'use client'

import Link from 'next/link'
import { BookOpen, ArrowRight, Tag, Clock } from 'lucide-react'
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
import { Programme } from '#/model'
import { formatDate } from '@/lib/utils'

interface ProgrammeCollectionProps {
  programme: Programme
}

export function ProgrammeCollection({ programme }: ProgrammeCollectionProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{programme.name}</span>
          <Badge variant="outline">{programme.alias}</Badge>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>Programme #{programme.id}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Alias</h3>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <span>{programme.alias}</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Mis à jour le {formatDate(programme.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href={webRoute('programme.show', { id: programme.id })}>
            Voir les détails
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
