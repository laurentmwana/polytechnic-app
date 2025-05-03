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
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

const LoginUser = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  return (
    <div>
      {isRedirecting ? (
        <Card className="rounded-xl">
          <CardHeader className="px-10 pt-8 pb-0 text-center">
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </CardHeader>
          <CardContent className="px-10 py-8 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </CardContent>
        </Card>
      ) : (
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
                    } else {
                      toast.error('Une erreur est survenue')
                    }
                    setIsSubmitting(false)
                  } else if (response?.ok) {
                    toast.success('Vous êtes connecté')

                    // Show skeleton during redirect
                    setIsRedirecting(true)

                    // Add a small delay to ensure the skeleton is visible
                    // and to allow the success toast to be seen
                    setTimeout(() => {
                      router.push(webRoute('welcome'))
                    }, 800)
                  }
                } catch (error: unknown) {
                  toast.error('Une erreur est survenue', {
                    description: (error as { message: string }).message,
                  })
                  setIsSubmitting(false)
                }
              }}
            />

            <div className="text-muted-foreground text-center text-sm mt-3">
              Vous avez oublié votre mot de passe ?{' '}
              <TextLink href={webRoute('forgot-password')} tabIndex={5}>
                Réinitialiser
              </TextLink>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LoginUser
