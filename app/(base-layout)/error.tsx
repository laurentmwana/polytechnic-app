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
    <div className="container py-12 space-y-6">
      <Heading title="Une erreur est survenue" description={error.message} />
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
  )
}
