import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingState() {
  return (
    <Card className="rounded-xl">
      <CardHeader className="px-10 pt-8 pb-0 text-center">
        <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
      </CardHeader>
      <CardContent className="px-10 py-8 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}
