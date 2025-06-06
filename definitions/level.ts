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

  option_id: z.string().min(1, "L'option est requise."),
});

export type SchemaLevelFormInfer = z.infer<typeof SchemaLevelForm>;
