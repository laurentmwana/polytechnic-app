'use client'

import { Calendar, ChevronRight, FileText } from 'lucide-react'
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
import { News } from '#/model'
import { ago } from '@/lib/date-time'
import Link from 'next/link'
import { webRoute } from '@/lib/route'

interface NewsCollectionProps {
  news: News[]
}

export function NewsCollection({ news }: NewsCollectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:border-primary/50 transition-colors"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg line-clamp-1">
                  {item.title}
                </CardTitle>
                {item.deliberation && (
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary shrink-0"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Délibération
                  </Badge>
                )}
              </div>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">{ago(item.created_at)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {item.message}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="ml-auto" asChild>
                <Link href={webRoute('news.show', { id: item.id })}>
                  Voir détails
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">
            Aucune actualité disponible pour le moment.
          </p>
        </div>
      )}
    </div>
  )
}
