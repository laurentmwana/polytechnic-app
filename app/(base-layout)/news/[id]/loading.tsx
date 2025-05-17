import { NewsDetailSkeleton } from '@/features/news/news-skeleton'

export default function Loading() {
  return (
    <main className="h-full flex items-center justify-center container py-12">
      <NewsDetailSkeleton />
    </main>
  )
}
