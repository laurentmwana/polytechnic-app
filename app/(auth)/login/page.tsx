'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginUserForm } from './login-form'
import { TextLink } from '@/components/shared/text-link'
import { useState } from 'react'
import { toast } from 'sonner'
import { webRoute } from '@/lib/route'
import { signIn } from 'next-auth/react'

const LoginUser = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div>
      <Card className="rounded-xl">
        <CardHeader className="px-10 pt-8 pb-0 text-center">
          <CardTitle className="text-xl">
            Connectez-vous à votre compte
          </CardTitle>
          <CardDescription>
            Entrez votre e-mail et mot de passe ci-dessous pour vous connecter
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 py-8">
          <LoginUserForm
            isSubmitting={isSubmitting}
            onSubmit={async (values) => {
              setIsSubmitting(true)
              try {
                const response = await signIn('credentials', {
                  email: values.email,
                  password: values.password,
                  redirect: false,
                })

                if (response?.error) {
                  if (response.error === 'CredentialsSignin') {
                    toast.error(`Adresse e-mail ou mot de passe incorrect`)
                  }
                } else if (response?.ok) {
                  toast.success('Vous êtes connecté')
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (error) {
                toast.error('Une erreur est survenue')
              } finally {
                setIsSubmitting(false)
              }
            }}
          />
          <div className="text-muted-foreground text-center text-sm mt-5">
            Vous n&#39;avez pas de compte ?{' '}
            <TextLink href="/register" tabIndex={5}>
              Inscrivez-vous
            </TextLink>
          </div>

          <div className="text-muted-foreground text-center text-sm mt-3">
            Vous avez oublié votre mot de passe ?{' '}
            <TextLink href={webRoute('forgot-password')} tabIndex={5}>
              Réinitialiser
            </TextLink>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginUser
