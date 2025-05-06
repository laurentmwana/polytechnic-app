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
import { LoginUserSchema, type LoginUserSchemaInfer } from '@/definitions/auth'
import { PasswordInput } from '@/components/ui/password-input'
import { Loader } from '@/components/ui/loader'
import { useEffect } from 'react'

type LoginUserFormProps = {
  onSubmit: (values: LoginUserSchemaInfer) => void
  isSubmitting: boolean
}

export const LoginUserForm = ({
  onSubmit,
  isSubmitting,
}: LoginUserFormProps) => {
  const form = useForm<LoginUserSchemaInfer>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Surveiller les changements de isSubmitting pour réinitialiser le mot de passe
  useEffect(() => {
    // Si isSubmitting passe de true à false, cela signifie que la soumission est terminée
    if (!isSubmitting) {
      // Réinitialiser uniquement le champ de mot de passe
      // tout en conservant les autres valeurs du formulaire
      const currentValues = form.getValues()

      form.setValue('email', currentValues.email, { shouldValidate: false })
      form.setValue('password', '', { shouldValidate: false })

      // Note: Nous ne validons pas après la réinitialisation pour éviter
      // de déclencher des erreurs de validation
    }
  }, [isSubmitting, form])

  const handleSubmit = async (values: LoginUserSchemaInfer) => {
    // Appeler la fonction onSubmit fournie par le parent
    await onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
