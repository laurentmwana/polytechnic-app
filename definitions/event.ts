import z from "zod";

export const SchemaEventForm = z.object({
  title: z
    .string()
    .min(1, { message: "Le titre est requis." })
    .max(200, { message: "Le titre est trop long (200 caractères max)." }),

  description: z
    .string()
    .min(1, { message: "La description est requise." })
    .max(500, { message: "La description est trop longue (500 caractères max)." }),

  content: z
    .string()
    .min(1, { message: "Le contenu est requis." })
    .max(5000, { message: "Le contenu est trop long (5000 caractères max)." }),

  start_at: z
    .string()
    .min(1, { message: "La date de début est requise." })
    .refine(
      (val) => !isNaN(Date.parse(val)),
      { message: "La date de début n'est pas valide." }
    ),

  tags: z
    .array(
      z.string()
        .min(1, { message: "Un tag ne peut pas être vide." })
    )
    .min(1, { message: "Au moins un tag est requis." }),

  level_id: z
    .string()
    .min(1, { message: "Le niveau est requis." }),

  year_academic_id: z
    .string()
    .optional()
    .or(z.literal("")),

  url: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => val === "" || /^https?:\/\/[\w.-]+(?:\.[\w\.-]+)+(?:[\/\w\.-]*)*\/?$/.test(val),
      { message: "Le lien doit être une URL valide." }
    )
});

export type SchemaEventFormInfer = z.infer<typeof SchemaEventForm>;
