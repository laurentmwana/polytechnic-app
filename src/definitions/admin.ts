import { z } from 'zod'

export const OptionFormSchema = z.object({
  name: z.string().min(2, 'Le nom est requis.').max(255),
  alias: z.string().min(2, 'Le nom est requis.').max(10),
  description: z.string().min(10).max(5000).optional(),
  department_id: z.number(),
})

export type OptionFormSchemaInfer = z.infer<typeof OptionFormSchema>
