'use client'

import { UserMe } from '@/types/model'
import { Alert, AlertDescription } from '../ui/alert'

export const UnverifiedEmail = ({ user }: { user?: UserMe }) => {
  if (!user || !user.isEmailVerified) {
    return null
  }

  return (
    <Alert>
      <AlertDescription>
        <strong>{user.name}</strong> votre adresse e-mail n&#39;est verifié,
        cliquez sur le bouton ci-dessous pour envoyer un email de confirmation
      </AlertDescription>
    </Alert>
  )
}
