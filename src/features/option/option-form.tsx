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
import { OptionFormSchemaInfer, OptionFormSchema } from '@/definitions/admin'
import { Textarea } from '@/components/ui/textarea'

type OptionFormProps = {
  onSubmit: (values: OptionFormSchemaInfer) => void
  isSubmitting: boolean
  defaultValues?: {
    name: string
    alias: string
    description: string
    department_id: number
  }
}

export const OptionForm = ({
  onSubmit,
  isSubmitting,
  defaultValues = {
    name: '',
    alias: '',
    description: '',
    department_id: 0,
  },
}: OptionFormProps) => {
  const form = useForm<OptionFormSchemaInfer>({
    resolver: zodResolver(OptionFormSchema),
    defaultValues,
  })

  const handleSubmit = async (values: OptionFormSchemaInfer) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input type="text" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alias</FormLabel>
              <FormControl>
                <Input type="text" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
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
