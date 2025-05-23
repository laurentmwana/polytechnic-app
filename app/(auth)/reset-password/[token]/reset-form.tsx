'use client'

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
import {
  ResetPasswordSchema,
  ResetPasswordSchemaInfer,
} from '@/definitions/auth'
import { PasswordInput } from '@/components/ui/password-input'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'

type ResetPasswordFormProps = {
  email: string
  processing: boolean
  onSubmit: (values: ResetPasswordSchemaInfer) => Promise<void>
}

export const ResetPasswordForm = ({
  email,
  processing,
  onSubmit,
}: ResetPasswordFormProps) => {
  const form = useForm<ResetPasswordSchemaInfer>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: email,
      password: '',
      password_confirmation: '',
    },
  })

  const handleSubmit = (values: ResetPasswordSchemaInfer): void => {
    onSubmit(values).then(() => {
      if (!processing) {
        form.reset({ password: '', password_confirmation: '' })
      }
    })
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
                <Input type="email" {...field} />
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

        <Button type="submit" className="w-full">
          {processing ? <Loader /> : 'Modifier'}
        </Button>
      </form>
    </Form>
  )
}
