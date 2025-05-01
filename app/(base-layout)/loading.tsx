import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="container my-12">
      <div className="flex items-center gap-3 mb-8">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-20 ml-2 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="h-full flex flex-col overflow-hidden border-t-4 border-t-muted"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-2">
                <Skeleton className="h-5 w-5 rounded-full mt-1" />
                <Skeleton className="h-6 w-full" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-3.5 w-3.5 rounded-full" />
                <Skeleton className="h-3.5 w-32" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
