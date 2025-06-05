import z from "zod";

export const SchemaCourseForm = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis.")
    .max(100, "Le nom est trop long."),

  code: z
    .string()
    .min(1, "Le code est requis.")
    .max(100, "Le code est trop long."),

  credits: z
    .string()
    .min(1, "Le crédit est requis.")
    .max(20, "Le crédit est trop long."),

  level_id: z.string().min(1, "Le niveau est requis."),

  teacher_id: z.string().min(1, "Le professeur est requise."),
});

export type SchemaCourseFormInfer = z.infer<typeof SchemaCourseForm>;
