import { Skeleton } from '@/components/ui/skeleton'

export const ProfileSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="rounded-md w-full p-7"></Skeleton>
      <Skeleton className="rounded-md w-full p-7"></Skeleton>
      <Skeleton className="rounded-md w-full p-7"></Skeleton>
    </div>
  )
}
