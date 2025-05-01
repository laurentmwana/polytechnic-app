'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TextLink } from '@/components/shared/text-link'
import { ForgotPasswordForm } from './forgot-form'
import { useState } from 'react'
import { ForgotPasswordSchemaInfer } from '@/definitions/auth.schema'
import { toast } from 'sonner'
import { forgotPasswordUser } from '@/repositories/auth.repo'

const ForgotPassword = () => {
  const [processing, setProcessing] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (data: ForgotPasswordSchemaInfer) => {
    setProcessing(true)

    try {
      const json = await forgotPasswordUser(data.email)

      if (json.success) {
        setMessage(
          'Nous vous avons envoyé un e-mail de réinitialisation de mot de passe 🙂'
        )
      } else {
        setMessage(
          "Nous n'avons pas pu vous envoyer un e-mail de réinitialisation de mot de passe. Merci de réessayer."
        )
      }
    } catch (error) {
      toast.error('Une erreur est survenue', {
        description:
          (error as { message?: string })?.message || 'Erreur inconnue',
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div>
      <Card className="rounded-xl">
        <CardHeader className="px-10 pt-8 pb-0 text-center">
          <CardTitle className="text-xl">Mot de passe oublié</CardTitle>
          <CardDescription>
            {message
              ? message
              : 'Entrez votre e-mail pour recevoir un lien de réinitialisation'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 py-8">
          {!message && (
            <ForgotPasswordForm processing={processing} onSubmit={onSubmit} />
          )}

          <div className="text-muted-foreground space-x-1 text-center text-sm mt-6">
            <span>Ou, retour </span>
            <TextLink href="/login">à la connexion</TextLink>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword
