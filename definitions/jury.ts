import z from "zod";

export const SchemaJuryForm = z.object({
  deliberation_id: z.string().min(1, "La délibération est requise."),
  teacher_id: z.string().min(1, "Le professeur est requis."),
});

export type SchemaJuryFormInfer = z.infer<typeof SchemaJuryForm>;
