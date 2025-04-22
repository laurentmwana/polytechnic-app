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
import { LoginUserSchema, LoginUserSchemaInfer } from '@schemas/auth-schema'
import { PasswordInput } from '@/components/ui/password-input'

export const LoginUserForm = () => {
  const form = useForm<LoginUserSchemaInfer>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: LoginUserSchemaInfer): void => {
    console.log(values)
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
                <Input type="email" {...field} />
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
                <PasswordInput {...field} />
              </FormControl>
              <FormDescription>
                Doit contenir au moins 8 caractères pour des raisons de sécurité.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Se connecter
        </Button>
      </form>
    </Form>
  )
}
