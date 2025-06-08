import z from "zod";

export const SchemaDepartmentForm = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis.")
    .max(100, "Le nom est trop long."),

  alias: z
    .string()
    .min(2, "L'alias est requis.")
    .max(20, "L'alias est trop long."),
});

export type SchemaDepartmentFormInfer = z.infer<typeof SchemaDepartmentForm>;
