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
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ProfileEditFormSchema,
  type ProfileEditFormSchemaInfer,
} from '@/definitions/profile'
import { useState } from 'react'
import { editUserInfo } from '@/repositories/profile'
import { toast } from 'sonner'
import type { ValidationError } from '@/types/util'

type ProfileInfoFormProps = {
  name: string
  email: string
  token: string
}

export const ProfileInfoForm = ({
  email,
  name,
  token,
}: ProfileInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-3">Informations du profil</CardTitle>
        <CardDescription>
          Mettre à jour votre nom et votre adresse e-mail
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="max-w-lg">
          <ProfileEditForm
            email={email}
            name={name}
            token={token}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export const ProfileEditForm = ({
  email,
  name,
  token,
}: ProfileInfoFormProps) => {
  const [processing, setProcessing] = useState<boolean>(false)
  const [isUpdatingSession, setIsUpdatingSession] = useState<boolean>(false)

  const form = useForm<ProfileEditFormSchemaInfer>({
    resolver: zodResolver(ProfileEditFormSchema),
    defaultValues: {
      name,
      email,
    },
  })

  const onSubmit = async (values: ProfileEditFormSchemaInfer) => {
    setProcessing(true)

    setIsUpdatingSession(true)

    try {
      const response = await editUserInfo(values, token)

      if (response.ok) {
        toast.success('Message', {
          description: 'Vos informations ont été editées',
        })
      }

      const data = await response.json()

      if (response.status === 401) {
        toast.error('Authentification', {
          description: 'Votre token est expiré',
        })
      }

      if (response.status === 422) {
        const validator = data as ValidationError

        toast.error('Validation', {
          description: validator.message,
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
