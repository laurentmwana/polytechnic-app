'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/ui/password-input'
import { Loader } from '@/components/ui/loader'
import {
  ProfilePasswordFormSchema,
  type ProfilePasswordFormSchemaInfer,
} from '@/definitions/profile'
import { useState } from 'react'
import { changePasswordProfile } from '@/actions/profile'
import { toast } from 'sonner'
import type { FormErrorValidator } from '#/error'
import { signOut } from 'next-auth/react'

export const ProfileUpdatePasswordForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-3">Mettre à jour le mot de passe</CardTitle>
        <CardDescription>
          Assurez-vous que votre compte utilise un mot de passe long et
          aléatoire pour rester sécurisé
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="max-w-lg">
          <PasswordUpdateForm />
        </div>
      </CardContent>
    </Card>
  )
}

const PasswordUpdateForm = () => {
  const [processing, setProcessing] = useState<boolean>(false)
  const [isUpdatingSession, setIsUpdatingSession] = useState<boolean>(false)

  const form = useForm<ProfilePasswordFormSchemaInfer>({
    resolver: zodResolver(ProfilePasswordFormSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  })

  const onSubmit = async (values: ProfilePasswordFormSchemaInfer) => {
    setProcessing(true)
    setIsUpdatingSession(true)

    try {
      const response = await changePasswordProfile(values)

      if (response.ok) {
        toast.success('Message', {
          description: 'Votre mot de passe a été modifié',
        })

        form.reset()

        return
      }

      if (response.status === 401) {
        toast.error('Authentification', {
          description: 'Votre token est expiré',
        })

        await signOut({
          redirect: true,
        })
      }

      if (response.status === 422) {
        const formErrors = (await response.json()) as FormErrorValidator<
          ['password', 'current_password', 'password_confirmation']
        >

        const fieldNames: (keyof ProfilePasswordFormSchemaInfer)[] = [
          'current_password',
          'password',
          'password_confirmation',
        ]

        form.clearErrors()

        fieldNames.forEach((fieldName) => {
          if (formErrors.errors[fieldName]?.length) {
            // Utiliser le premier message d'erreur du tableau pour ce champ
            form.setError(fieldName, {
              type: 'server',
              message: formErrors.errors[fieldName][0],
            })
          }
        })
      }
    } catch (error: unknown) {
      toast.error('Une problème est survenu', {
        description: (error as { message: string }).message,
      })
    } finally {
      setProcessing(false)
      setIsUpdatingSession(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ancien mot de passe</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmation du mot de passe</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="outline"
          size="sm"
          type="submit"
          disabled={processing || isUpdatingSession}
        >
          {processing ? (
            <Loader />
          ) : isUpdatingSession ? (
            'Mise à jour de la session...'
          ) : (
            'Mettre à jour'
          )}
        </Button>
      </form>
    </Form>
  )
}
