'use client'

import { Calendar } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Clock, FileText, MessageSquare } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface NewsCollectionSkeletonProps {
  count?: number
}

export function NewsCollectionSkeleton({
  count = 6,
}: NewsCollectionSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {/* Title skeleton */}
        <div className="h-8 w-36 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        {/* Badge skeleton */}
        <Badge
          variant="outline"
          className="bg-gray-200 dark:bg-gray-700 text-transparent animate-pulse"
        >
          {count} publications
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                {/* Title skeleton */}
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                {/* Badge skeleton - only show on some cards */}
                {index % 3 === 0 && (
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                )}
              </div>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Calendar className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
                {/* Date skeleton */}
                <div className="h-3.5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Message preview skeleton - 3 lines */}
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                    style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-end">
              {/* Button skeleton */}
              <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function NewsDetailSkeleton() {
  return (
    <div className="space-y-6 w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-2">
                {/* Title skeleton */}
                <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                {/* Badge skeleton */}
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              </div>
              <CardDescription className="mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  {/* Date skeleton */}
                  <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </div>
              </CardDescription>
            </div>
            {/* Button skeleton */}
            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-gray-300 dark:text-gray-600 mt-1" />
              <div className="w-full">
                {/* Message title skeleton */}
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 animate-pulse" />
                {/* Message content skeleton - multiple lines */}
                <div className="space-y-2 w-full">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                      style={{
                        width: `${Math.floor(Math.random() * 30) + 70}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Deliberation skeleton */}
          <Separator />
          <div className="flex items-start gap-2">
            <FileText className="h-5 w-5 text-gray-300 dark:text-gray-600 mt-1" />
            <div className="w-full">
              {/* Deliberation title skeleton */}
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 animate-pulse" />
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  {/* Deliberation card title skeleton */}
                  <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </CardHeader>
                <CardContent>
                  {/* Deliberation description skeleton */}
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                        style={{
                          width: `${Math.floor(Math.random() * 20) + 80}%`,
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground pt-0">
                  {/* Deliberation date skeleton */}
                  <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                </CardFooter>
              </Card>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
              {/* Created date skeleton */}
              <div className="h-3.5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
              {/* Updated date skeleton */}
              <div className="h-3.5 w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
