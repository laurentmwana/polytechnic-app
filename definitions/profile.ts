import { z } from "zod";

export const SchemaProfileInfo = z.object({
  name: z.string().min(1, "Le nom est requis."),
  email: z
    .string()
    .email("Adresse e-mail invalide.")
    .min(1, "L’email est requis."),
});

export type SchemaProfileInfoInfer = z.infer<typeof SchemaProfileInfo>;

export const SchemaProfilePassword = z
  .object({
    current_password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    password_confirmation: z
      .string()
      .min(8, "La confirmation du mot de passe est requise."),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["password_confirmation"],
  });

export type SchemaProfilePasswordInfer = z.infer<typeof SchemaProfilePassword>;