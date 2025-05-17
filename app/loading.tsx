import { Loader } from '@/components/ui/loader'

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div>
        <Loader size={30} variant="dual-ring" />
      </div>
    </div>
  )
}
