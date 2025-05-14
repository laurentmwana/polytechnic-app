import { Skeleton } from '@/components/ui/skeleton'

export const AuthLoader = () => {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-center mb-6">
        <Skeleton className="h-12 w-3/4" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <div className="flex justify-end mt-6">
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}
