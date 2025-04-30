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
  ProfilePasswordFormSchemaInfer,
} from '@/definitions/profile.schema'
import { useState } from 'react'

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

  const form = useForm<ProfilePasswordFormSchemaInfer>({
    resolver: zodResolver(ProfilePasswordFormSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  })

  const handleSubmit = (values: ProfilePasswordFormSchemaInfer): void => {
    setProcessing(true)
    console.log(values)
    setProcessing(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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

        <Button type="submit" size="sm" variant="outline">
          {processing ? <Loader /> : 'Mettre à jour'}
        </Button>
      </form>
    </Form>
  )
}
