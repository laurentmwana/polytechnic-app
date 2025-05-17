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
  ContactUsFormSchemaInfer,
  ContactUsFormSchema,
} from '@/definitions/contact'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { toast } from 'sonner'

export const ContactForm = () => {
  const [processing, setProcessing] = useState<boolean>(false)

  const form = useForm<ContactUsFormSchemaInfer>({
    resolver: zodResolver(ContactUsFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async (values: ContactUsFormSchemaInfer) => {
    setProcessing(true)
    const response = await fetchJson(apiRoute('contact.send'), {
      method: 'POST',
      body: values,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    if (response.status === 200) {
      toast.success('Succès', {
        description: 'Votre message a été envoyé avec succès.',
      })

      form.reset()
    } else {
      toast.error('Problème', {
        description: 'Une erreur est survenue, merci de réessayer',
      })
    }

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
                <Input {...field} value={field.value || ''} />
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
                <Input type="email" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sujet</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mesage</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button size="sm" variant="outline" type="submit" disabled={processing}>
          {processing ? <Loader /> : 'Envoyer'}
        </Button>
      </form>
    </Form>
  )
}
