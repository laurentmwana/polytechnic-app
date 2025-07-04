import { z } from "zod";

export const SchemaProfileInfo = z.object({
  name: z.string().min(1, "Le nom est requis."),
  email: z
    .string()
    .min(1, "L’email est requis.")
    .email("Adresse e-mail invalide."),
});

export type SchemaProfileInfoInfer = z.infer<typeof SchemaProfileInfo>;

export const SchemaProfilePassword = z
  .object({
    current_password: z
      .string()
      .min(8, "Le mot de passe actuel doit contenir au moins 8 caractères."),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule.")
      .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre.")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Le mot de passe doit contenir au moins un caractère spécial."
      ),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["password_confirmation"],
  });

export type SchemaProfilePasswordInfer = z.infer<typeof SchemaProfilePassword>;
