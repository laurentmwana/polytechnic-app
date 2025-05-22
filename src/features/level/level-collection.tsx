import Link from 'next/link'
import { Calendar, GraduationCap, ArrowRight, BookOpen } from 'lucide-react'
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
import { Level } from '#/model'
import { formatDate } from '@/lib/utils'

interface LevelCollectionProps {
  level: Level
}

export function LevelCollection({ level }: LevelCollectionProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{level.programme.name}</span>
          <Badge variant="outline">{level.programme.alias}</Badge>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          <span>Promotion #{level.id}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Option</h3>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>{level.option.name}</span>
            </div>
            {level.option.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {level.option.description}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Programme</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {level.programme.programme_group}
              </Badge>
              <span className="text-sm">{level.programme.name}</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Mis à jour le {formatDate(level.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href={webRoute('level.show', { id: level.id })}>
            Voir les détails
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
