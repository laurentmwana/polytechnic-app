import { Loader } from '@/components/ui/loader'

export default function Loading() {
  return (
    <main className="h-full flex items-center justify-center ">
      <div>
        <Loader size={30} variant="dual-ring" />
      </div>
    </main>
  )
}
