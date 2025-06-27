import z from "zod";

export const ResetPasswordSchema = z
  .object({
    email: z
      .string()
      .email("Adresse e-mail invalide.")
      .min(1, "L’email est requis."),
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

export type ResetPasswordSchemaInfer = z.infer<typeof ResetPasswordSchema>;
