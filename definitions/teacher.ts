import { z } from "zod";

export const SchemaTeacherForm = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis.")
    .max(100, "Le nom est trop long."),

  firstname: z
    .string()
    .min(1, "Le prénom est requis.")
    .max(100, "Le prénom est trop long."),

  gender: z
    .string()
    .min(1, "Le genre est requis.")
    .refine((val) => ["homme", "femme"].includes(val.toLowerCase()), {
      message: "Le genre doit être 'homme' ou 'femme'.",
    }),

  phone: z
    .string()
    .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres.")
    .max(15, "Le numéro de téléphone est trop long.")
    .regex(
      /^\+?\d+$/,
      "Le numéro de téléphone doit contenir uniquement des chiffres et un '+' optionnel au début."
    ),

  department_id: z.string().min(1, "Le département est requis."),
});

export type SchemaTeacherFormInfer = z.infer<typeof SchemaTeacherForm>;
