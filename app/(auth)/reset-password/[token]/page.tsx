'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ResetPasswordForm } from './reset-form'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ResetPasswordSchemaInfer } from '@/definitions/auth.schema'
import { toast } from 'sonner'
import { webRoute } from '@/lib/route'
import { resetPasswordUser } from '@/repositories/auth.repo'

const ResetPassword = () => {
  const [processing, setProcessing] = useState<boolean>(false)

  const router = useRouter()

  const params = useParams<{ token: string }>()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const onSubmit = async (values: ResetPasswordSchemaInfer) => {
    setProcessing(true)

    try {
      const json = await resetPasswordUser({
        ...values,
        token: params.token,
      })

      toast.info('Action', {
        description: json.data.email,
      })

      router.push(webRoute('login'))
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
          <CardTitle className="text-xl">
            Réinitialisation du mot de passe
          </CardTitle>
          <CardDescription>
            Veuillez entrer votre nouveau mot de passe ci-dessous
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 py-8">
          <ResetPasswordForm
            email={email ?? ''}
            processing={processing}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword
