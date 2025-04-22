'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  LoginUserSchema,
  LoginUserSchemaInfer,
} from '@/definitions/auth-schema'
import { PasswordInput } from '@/components/ui/password-input'
import { loginUser } from '@/actions/auth'
import { ApiError } from '@/lib/fetch'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader } from '@/components/ui/loader'
import { webRoute } from '@/lib/route'
import { useRouter } from 'next/navigation'

export const LoginUserForm = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LoginUserSchemaInfer>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onResetPassword = () => {
    form.reset({
      email: form.getValues('email'),
      password: '',
    })
  }

  const onSubmit = async (values: LoginUserSchemaInfer) => {
    setIsSubmitting(true)

    try {
      const loginResponse = await loginUser(values)

      if (loginResponse) {
        router.push(webRoute('welcome'))
      } else {
        toast.error("Problème d'authentification", {
          description: 'Une erreur est survenue, merci de réessayer (:',
        })
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.validationErrors) {
          Object.entries(error.validationErrors).forEach(
            ([field, messages]) => {
              messages.forEach((message) => toast.error(`${field}: ${message}`))
            }
          )
        } else if (error.response.status === 500) {
          toast.error('Problème de connexion internet')
        } else {
          toast.error(error.response.message)
        }
      }
    } finally {
      setIsSubmitting(false)
      onResetPassword()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse e-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...field}
                  value={field.value || ''} // Garantit une string vide si undefined
                />
              </FormControl>
              <FormDescription>
                Utilisée pour vous connecter et recevoir les notifications.
              </FormDescription>
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
                <PasswordInput
                  {...field}
                  value={field.value || ''} // Garantit une string vide si undefined
                />
              </FormControl>
              <FormDescription>
                Doit contenir au moins 8 caractères pour des raisons de
                sécurité.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader /> : 'Se connecter'}
        </Button>
      </form>
    </Form>
  )
}
