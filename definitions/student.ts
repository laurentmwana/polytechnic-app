import z from "zod";

export const SchemaStudentForm = z.object({
  name: z.string().min(5, "Le nom est requis."),
  firstname: z.string().min(5, "Le postnom est requis."),
  gender: z.string().min(5, "Le genre est requis."),
  phone: z.string().min(5, "Le numéro de téléphone  est requis."),
  level_id: z.string(),
  year_academic_id: z.string(),
});

export type SchemaStudentFormInfer = z.infer<typeof SchemaStudentForm>;
