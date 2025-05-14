import { Skeleton } from '@/components/ui/skeleton'
import { Heading } from '@/components/shared/heading'
import { OptionLoader } from './option-loader'

export default function Loading() {
  return (
    <main className="container py-12">
      <Heading title="Nos options" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="w-full md:w-1/3">
          <Skeleton className="h-10 w-full" />
        </div>

        <Skeleton className="h-10 w-40" />
      </div>
      <OptionLoader />
    </main>
  )
}
