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
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaInfer,
} from '@/definitions/auth'
import { Loader } from '@/components/ui/loader'

type ForgotPasswordFormProps = {
  onSubmit: (values: ForgotPasswordSchemaInfer) => Promise<void>
  processing: boolean
}

export const ForgotPasswordForm = ({
  processing,
  onSubmit,
}: ForgotPasswordFormProps) => {
  const form = useForm<ForgotPasswordSchemaInfer>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleSubmit = async (values: ForgotPasswordSchemaInfer) => {
    onSubmit(values).then(() => {
      if (!processing) {
        form.reset({ email: '' })
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

        <Button type="submit" className="w-full">
          {processing ? <Loader /> : 'Envoyer'}
        </Button>
      </form>
    </Form>
  )
}
