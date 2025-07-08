import z from "zod";

export const SchemaCourseForm = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis.")
    .max(100, "Le nom est trop long (maximum 100 caractères).")
    .trim(),

  code: z
    .string()
    .min(1, "Le code est requis.")
    .max(20, "Le code est trop long (maximum 20 caractères).")
    .regex(
      /^[A-Za-z0-9-_]+$/,
      "Le code ne peut contenir que des lettres, chiffres, tirets ou underscores."
    )
    .trim(),

  credits: z
    .string()
    .min(1, "Le nombre de crédits est requis.")
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val), {
      message: "Le nombre de crédits doit être un entier.",
    })
    .refine((val) => val >= 1, {
      message: "Le nombre de crédits doit être au moins 1.",
    })
    .refine((val) => val <= 30, {
      message: "Le nombre de crédits ne peut pas dépasser 30.",
    }),

  level_id: z.string().min(1, "Le niveau est requis."),

  semester: z.enum(["semestre 1", "semestre 2"], {
    errorMap: () => ({
      message: "Le semestre doit être 'semestre 1' ou 'semestre 2'.",
    }),
  }),

  teacher_id: z.string().min(1, "Le professeur est requis."),
});

export type SchemaCourseFormInfer = z.infer<typeof SchemaCourseForm>;
