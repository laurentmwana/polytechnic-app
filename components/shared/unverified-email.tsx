'use client'

import type { UserMe } from '@/types/model'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { webRoute } from '@/lib/route'
import Link from 'next/link'

export const UnverifiedEmail = ({ user }: { user?: UserMe }) => {
  if (!user || user.isEmailVerified) {
    return null
  }

  return (
    <Alert>
      <AlertTitle className="capitalize">{user.name}</AlertTitle>
      <AlertDescription className="flex items-center gap-1 flex-wrap whitespace-nowrap">
        Votre adresse e-mail n&apos;est pas vérifiée. Cliquez
        <Link className="underline font-medium" href={webRoute('verify-email')}>
          ici
        </Link>
        pour envoyer un email de confirmation.
      </AlertDescription>
    </Alert>
  )
}
