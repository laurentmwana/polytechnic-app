import z from "zod";

export const SchemaDeliberationForm = z.object({
  criteria: z
    .string()
    .min(1, "Le critère est requis.") // min 1 caractère (100 c'est trop strict si tu veux le rendre obligatoire)
    .max(90000, "Le critère est trop long."),

  start_at: z
    .string()
    .min(1, "La date de début est requise.")
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "La date de début doit être une date valide."
    ),

  semester: z.string().min(1, "Le semestre est requis."),

  year_academic_id: z.string().min(1, "L'année académique est requise."),

  level_id: z.string().min(1, "La promotion est requise."),
});

export type SchemaDeliberationFormInfer = z.infer<
  typeof SchemaDeliberationForm
>;
