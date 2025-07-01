import { z } from "zod";

export const SchemaResultForm = z.object({
  file: z
    .custom<File>((val) => val instanceof File, {
      message: "Le fichier est requis.",
    })
    .refine(
      (file) => file.name.endsWith(".xlsx") || file.name.endsWith(".xls"),
      {
        message: "Le fichier doit être un Excel (.xlsx ou .xls).",
      }
    ),
  deliberation_id: z.string().min(1, "La délibération est requise."),
});
export type SchemaResultFormInfer = z.infer<typeof SchemaResultForm>;
