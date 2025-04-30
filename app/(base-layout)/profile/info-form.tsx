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
  ProfileEditFormSchemaInfer,
} from '@/definitions/profile.schema'
import { useState } from 'react'

type ProfileInfoFormProps = { name: string; email: string }

export const ProfileInfoForm = ({ email, name }: ProfileInfoFormProps) => {
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
          <ProfileEditForm email={email} name={name} />
        </div>
      </CardContent>
    </Card>
  )
}

export const ProfileEditForm = ({ email, name }: ProfileInfoFormProps) => {
  const [processing, setProcessing] = useState<boolean>(false)

  const form = useForm<ProfileEditFormSchemaInfer>({
    resolver: zodResolver(ProfileEditFormSchema),
    defaultValues: {
      name,
      email,
    },
  })

  const onSubmit = (values: ProfileEditFormSchemaInfer) => {
    setProcessing(true)

    console.log(values)

    setProcessing(false)
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

        <Button variant="outline" size="sm" type="submit">
          {processing ? <Loader /> : 'Mettre à jour'}
        </Button>
      </form>
    </Form>
  )
}
