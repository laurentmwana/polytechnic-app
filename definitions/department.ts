import z from "zod";

export const SchemaDepartmentForm = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis.")
    .max(100, "Le nom est trop long."),

  alias: z
    .string()
    .min(1, "L'alias est requis.") // Min 1 caractère pour être plus souple
    .max(20, "L'alias est trop long."),
});

export type SchemaDepartmentFormInfer = z.infer<typeof SchemaDepartmentForm>;
