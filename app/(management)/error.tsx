'use client'

import { Heading } from '@/components/shared/heading'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { useEffect, useState } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [processing, setProcessing] = useState<boolean>(false)

  useEffect(() => {
    console.error(error)
  }, [error])

  const onRefreshPage = () => {
    setProcessing(true)
    reset()
    setProcessing(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
          <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-5 md:min-h-min">
            <Heading
              title="Une erreur est survenue"
              description={error.message}
            />
            <Button onClick={() => onRefreshPage()}>
              {processing ? (
                <div className="flex items-center gap-2">
                  <Loader variant="default" />
                  <span>Chargement...</span>
                </div>
              ) : (
                'Réessayer'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
