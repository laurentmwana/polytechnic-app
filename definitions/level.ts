import z from "zod";

export const SchemaLevelForm = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis.")
    .max(100, "Le nom est trop long."),

  alias: z
    .string()
    .min(1, "L'alias est requis.")
    .max(100, "L'alias est trop long."),

  programme: z.string(),

  department_id: z.string().min(1, "Le départment est requis.").optional(),
});

export type SchemaLevelFormInfer = z.infer<typeof SchemaLevelForm>;
