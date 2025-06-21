import { z } from "zod";

export const SchemaUserForm = z
  .object({
    name: z.string().min(1, "Le nom est requis."), // min 1, pas 5 (sinon le message ne correspond pas)
    email: z
      .string()
      .email("Adresse e-mail invalide.")
      .min(1, "L’email est requis."),
    student_id: z.string().optional(), // facultatif, sinon préciser dans message
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."), // corrigé de 6 à 8 dans message
    password_confirmation: z
      .string()
      .min(8, "La confirmation du mot de passe est requise."),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["password_confirmation"],
  });

export type SchemaUserFormInfer = z.infer<typeof SchemaUserForm>;
