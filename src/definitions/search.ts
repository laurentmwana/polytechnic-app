import { z } from 'zod'

export const SearchInputSchema = z.object({
  search: z
    .string()
    .min(1, 'Le mot de passe doit contenir au moins 8 caractères.'),
})
export type SearchInputSchemaInfer = z.infer<typeof SearchInputSchema>
