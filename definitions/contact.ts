import { z } from 'zod'

export const ContactUsFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.'),
  email: z
    .string()
    .email('Adresse e-mail invalide.')
    .min(1, 'L’email est requis.'),

  subject: z.string().min(3, 'Le sujet est requis.'),
  message: z.string().min(20, 'Le message est requis.'),
})

export type ContactUsFormSchemaInfer = z.infer<typeof ContactUsFormSchema>
