import z from "zod";

export const SchemaUserForm = z
  .object({
    name: z.string().min(5, "Le nom est requis."),
    email: z
      .string()
      .email("Adresse e-mail invalide.")
      .min(1, "L’email est requis."),
    student_id: z.string(),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 6 caractères."),
    password_confirmation: z
      .string()
      .min(8, "La confirmation du mot de passe est requise."),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["password_confirmation"],
  });

export type SchemaUserFormInfer = z.infer<typeof SchemaUserForm>;
