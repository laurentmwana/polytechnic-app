'use client'

import { Heading } from '@/components/shared/heading'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function ErrorDepartment({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container py-12 space-y-6">
      <Heading title="Une erreur est survenue" description={error.message} />
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Réessayer
      </Button>
    </div>
  )
}
