import z from "zod";

export const SchemaDeliberationForm = z.object({
  criteria: z
    .string()
    .min(100, "Le critère est requis.")
    .max(90000, "Le critère est trop long."),

  start_at: z.string(),

  semester: z.string(),

  year_academic_id: z.string().min(1, "L'année académique est requise."),
  level_id: z.string().min(1, "La promotion est requise."),
});

export type SchemaDeliberationFormInfer = z.infer<
  typeof SchemaDeliberationForm
>;
