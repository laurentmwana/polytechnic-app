import { z } from "zod";

export const SchemaStudentForm = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis.")
    .max(100, "Le nom est trop long."),

  firstname: z
    .string()
    .min(1, "Le prénom est requis.")
    .max(100, "Le prénom est trop long."),

  gender: z
    .string()
    .min(1, "Le genre est requis.")
    .refine((val) => ["homme", "femme"].includes(val.toLowerCase()), {
      message: "Le genre doit être 'homme', 'femme'.",
    }),

  phone: z
    .string()
    .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres.")
    .max(15, "Le numéro de téléphone est trop long.")
    .regex(
      /^\+?\d+$/,
      "Le numéro de téléphone doit contenir uniquement des chiffres, avec un '+' optionnel au début."
    ),

  level_id: z.string().min(1, "Le niveau est requis."),

  year_academic_id: z.string().min(1, "L'année académique est requise."),
});

export type SchemaStudentFormInfer = z.infer<typeof SchemaStudentForm>;

export const SchemaStudentExcelForm = z.object({
  file: z
    .instanceof(File, { message: "Le fichier est requis." })
    .refine(
      (file) => file.name.endsWith(".xlsx") || file.name.endsWith(".xls"),
      {
        message: "Le fichier doit être un Excel (.xlsx ou .xls).",
      }
    ),
});

export type SchemaStudentExcelFormInfer = z.infer<
  typeof SchemaStudentExcelForm
>;
