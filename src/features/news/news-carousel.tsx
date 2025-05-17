'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { CarouselApi } from '@/components/ui/carousel'
import { News } from '#/model'
import { ago } from '@/lib/date-time'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { webRoute } from '@/lib/route'

interface NewsCarouselProps {
  news?: News[]
  isLoading?: boolean
}

export function NewsCarousel({
  news = [],
  isLoading = false,
}: NewsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Mettre à jour le compteur et l'index actuel
  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // Gérer l'autoplay
  useEffect(() => {
    if (!api || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Démarrer l'autoplay
    intervalRef.current = setInterval(() => {
      api.scrollNext()
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [api, isPaused])

  return (
    <div
      className="w-full max-w-5xl mx-auto px-4 py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Actualités</h2>
        <div className="text-sm text-muted-foreground">
          {!isLoading && `${current} / ${count}`}
        </div>
      </div>

      {isLoading ? (
        <NewsCarouselSkeleton />
      ) : (
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent className="-ml-4">
            {news.length > 0 ? (
              news.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-4 sm:basis-1/1 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-4 text-sm">{item.message}</p>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground flex items-center justify-between">
                      <p>{ago(item.created_at)}</p>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={webRoute('news.show', { id: item.id })}>
                          <Eye size={15} />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="pl-4">
                <Card>
                  <CardContent className="flex items-center justify-center min-h-[200px]">
                    <p className="text-muted-foreground">
                      Aucune actualité disponible
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      )}
    </div>
  )
}

function NewsCarouselSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="h-full">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-3 w-1/3" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
