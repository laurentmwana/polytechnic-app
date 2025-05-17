import { NewsCollectionSkeleton } from '@/features/news/news-skeleton'

export default function Loading() {
  return (
    <main className="h-full flex items-center justify-center py-12">
      <NewsCollectionSkeleton />
    </main>
  )
}
