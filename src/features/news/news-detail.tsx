'use client'

import { Calendar, Clock, MessageSquare } from 'lucide-react'
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
import { formatDate } from '@/lib/utils'
import { Deliberation } from '#/model'
import { ago } from '@/lib/date-time'

interface NewsDetailProps {
  news: Deliberation
  onBack?: () => void
}

export function NewsDetail({ news, onBack }: NewsDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold">
                  {news.level.programme.name} {news.level.option.name}
                </CardTitle>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Délibération
                </Badge>
              </div>
              <CardDescription className="mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{ago(news.created_at)}</span>
                </div>
              </CardDescription>
            </div>
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                Retour
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <div className="flex items.start_at gap-2">
              <MessageSquare className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <div className="whitespace-pre-wrap">{news.description}</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>Créé le {formatDate(news.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>Dernière mise à jour le {formatDate(news.updated_at)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
