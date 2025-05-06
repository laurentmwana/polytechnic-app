'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MailIcon, Loader } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle } from 'lucide-react'
import { apiRoute } from '@/lib/route'
import { OtpInput } from './opt-input'
import { signOut } from 'next-auth/react'

type StatusVerifiedEmail = 'verified' | 'sending'

type VerifyEmailFormProps = {
  user: {
    accessToken: string
  },
  updateInformation: (isEmailVerified: boolean) => void
}

export function VerifyEmailForm({ user, updateInformation }: VerifyEmailFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<StatusVerifiedEmail | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otpValue, setOtpValue] = useState('')

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!user.accessToken) {
        toast.error('Session invalide', {
          description: 'Veuillez vous reconnecter.',
        })
        return
      }

      const token = user.accessToken

      const response = await fetch(apiRoute('verify-email'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        await signOut({
          redirect: true,
        })

        toast.info('Authentification', {
          description:
            'vous êtes déconnecté, car votre session a expiré, merci de vous reconnecter',
        })

        return
      }

      if (response.ok) {
        const data = (await response.json()) as {
          status: StatusVerifiedEmail
          message: string
        }

        setStatus(data.status)

        // Show OTP input
        setShowOtpInput(true)

        // Start the 2-minute cooldown
        setCountdown(120)
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(timer)
              return null
            }
            return prev ? prev - 1 : null
          })
        }, 1000)

        toast.success('Lien de vérification', {
          description: data.message,
        })

        return
      } else {
        let errorMessage =
          "Une erreur est survenue lors de l'envoi du lien de vérification."

        try {
          const errorData = await response.json()
          if (errorData && errorData.message) {
            errorMessage = errorData.message
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (parseError) {
          // If JSON parsing fails, use the default error message
        }

        toast.error('Erreur', {
          description: errorMessage,
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Erreur', {
        description:
          "Une erreur est survenue lors de l'envoi du lien de vérification.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle OTP verification
  const verifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast.error('Code incomplet', {
        description: 'Veuillez saisir le code à 6 chiffres complet.',
      })
      return
    }

    try {
      const fetchVerify = await fetch(
        apiRoute('verify-opt', {
          opt: otpValue,
        }),
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      const data = (await fetchVerify.json()) as { message: string }

      if (fetchVerify.ok) {
        toast.success('Code vérifié', {
          description: data.message,
        })

        updateInformation(true)

        // redirection vers la page /profile
        router.push('/profile')


      } else {
        toast.error('Erreur de vérification', {
          description: data.message,
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de la vérification du code.',
      })
    } finally {
      // Reset the form
      setShowOtpInput(false)
      setOtpValue('')
      setCountdown(null)
    }
  }

  return (
    <div className="max-w-md mx-auto w-full px-4">
      <Card className="rounded-xl">
        <CardHeader className="px-6 pt-6 pb-0 text-center sm:px-10">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-4">
            <MailIcon className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Vérification e-mail</CardTitle>
          <CardDescription className="mt-2">
            {showOtpInput
              ? 'Veuillez saisir le code de vérification reçu par e-mail.'
              : 'Veuillez vérifier votre adresse e-mail en cliquant sur le lien que nous venons de vous envoyer.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-6 sm:px-10 sm:py-8">
          {status === 'sending' && !showOtpInput && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Un nouveau lien de vérification a été envoyé à l&apos;adresse
                e-mail que vous avez fournie lors de l&apos;inscription.
              </AlertDescription>
            </Alert>
          )}

          {status === 'verified' && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Votre adresse email est déjà vérifiée.
              </AlertDescription>
            </Alert>
          )}

          {showOtpInput ? (
            <div className="space-y-6">
              <div className="text-center mb-2">
                {countdown !== null && (
                  <div className="text-sm text-muted-foreground mb-4">
                    Temps restant: {Math.floor(countdown / 60)}:
                    {(countdown % 60).toString().padStart(2, '0')}
                  </div>
                )}

                <OtpInput value={otpValue} onChange={setOtpValue} />

                <Button
                  className="w-full mt-6"
                  onClick={verifyOtp}
                  disabled={otpValue.length !== 6}
                >
                  Vérifier le code
                </Button>
              </div>

              {countdown === null && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Renvoyer un code'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Button
              className="w-full mt-4"
              onClick={onSubmit}
              disabled={isSubmitting || countdown !== null}
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : countdown !== null ? (
                <>
                  Réessayer dans {Math.floor(countdown / 60)}:
                  {(countdown % 60).toString().padStart(2, '0')}
                </>
              ) : (
                'Envoyer un nouveau lien'
              )}
            </Button>
          )}
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0 text-center text-sm text-muted-foreground sm:px-10 sm:pb-8">
          Si vous ne recevez pas d&apos;e-mail, vérifiez votre dossier de spam.
        </CardFooter>
      </Card>
    </div>
  )
}
