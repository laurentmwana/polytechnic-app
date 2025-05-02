'use server'

import {
  LoginUserSchemaInfer,
  ResetPasswordSchemaInfer,
} from '@/definitions/auth.schema'
import { apiRoute } from '@/lib/route'

export const loginUser = async (body: LoginUserSchemaInfer) => {
  return await fetch(apiRoute('login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export const logoutUser = async (token: string) => {
  const res = await fetch(apiRoute('logout'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error('Une erreur est survenue, merci de réessayer (:')
  }

  const data = (await res.json()) as { message: string }

  return { data }
}

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
