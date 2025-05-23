import { z } from 'zod'

export const LoginUserSchema = z.object({
  email: z
    .string()
    .email('Adresse e-mail invalide.')
    .min(1, 'L’email est requis.'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 6 caractères.'),
})

export type LoginUserSchemaInfer = z.infer<typeof LoginUserSchema>

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Adresse e-mail invalide.')
    .min(1, 'L’email est requis.'),
})

export type ForgotPasswordSchemaInfer = z.infer<typeof ForgotPasswordSchema>

export const ResetPasswordSchema = z
  .object({
    email: z
      .string()
      .email('Adresse e-mail invalide.')
      .min(1, 'L’email est requis.'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 6 caractères.'),
    password_confirmation: z
      .string()
      .min(8, 'La confirmation du mot de passe est requise.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['password_confirmation'],
  })

export type ResetPasswordSchemaInfer = z.infer<typeof ResetPasswordSchema>


export const SessionPayload =  z
  .object({
    email: z
      .string()
      .email('Adresse e-mail invalide.')
      .min(1, 'L’email est requis.'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 6 caractères.'),
    password_confirmation: z
      .string()
      .min(8, 'La confirmation du mot de passe est requise.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['password_confirmation'],
  })