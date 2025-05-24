import { Heading } from '@/components/shared/heading'
import { Loader } from '@/components/ui/loader'

export default function Loading() {
  return (
    <main className="container py-12">
      <Heading title="En savoir plus sur un frais de académique" />
      <Loader size={30} variant="dual-ring" />
    </main>
  )
}
