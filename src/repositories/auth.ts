'use server'

import type { ResetPasswordSchemaInfer } from '@/definitions/auth'
import { apiRoute } from '@/lib/route'

export const forgotPasswordUser = async (email: string) => {
  const res = await fetch(apiRoute('forgot-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.status || 'Erreur lors de la réinitialisation')
  }

  return json as { success: boolean }
}

export const resetPasswordUser = async (
  values: ResetPasswordSchemaInfer & { token: string }
) => {
  const res = await fetch(apiRoute('reset-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(values),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(
      json.status || 'Erreur lors de la modification du mot de passe'
    )
  }

  return json as { data: { email: string } }
}

export const verifyEmail = async (token: string) => {
  console.log(token)
  const response = await fetch(apiRoute('verify-email'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return response
}
