import z from "zod";

export const SchemaActualityForm = z.object({
  title: z
    .string()
    .min(2, "Le titre est requis et doit contenir au moins 2 caractères.")
    .max(255, "Le titre est trop long (maximum 255 caractères).")
    .trim(),

  description: z
    .string()
    .min(
      10,
      "La description est requise et doit contenir au moins 10 caractères."
    )
    .max(20000, "La description est trop longue (maximum 20 000 caractères).")
    .trim(),
});

export type SchemaActualityFormInfer = z.infer<typeof SchemaActualityForm>;

export const SchemaCommentForm = z.object({
  username: z
    .string()
    .min(2, "Le nom est requis et doit contenir au moins 2 caractères.")
    .max(20, "Le nom est trop long (maximum 20 caractères).")
    .regex(
      /^[\p{L}\p{N}_-]+$/u,
      "Le nom ne doit contenir que des lettres, chiffres, tirets ou underscores."
    )
    .trim(),

  message: z
    .string()
    .min(3, "Le message est requis et doit contenir au moins 3 caractères.")
    .max(10000, "Le message est trop long (maximum 10 000 caractères).")
    .trim(),
});

export type SchemaCommentFormInfer = z.infer<typeof SchemaCommentForm>;
