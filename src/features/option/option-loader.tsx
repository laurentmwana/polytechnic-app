'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export const OptionLoader = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <div className="space-y-2 mt-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
          <Skeleton className="h-9 w-full mt-4" />
        </Card>
      ))}
    </div>
  )
}
