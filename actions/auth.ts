'use server'

import { LoginUserSchemaInfer } from '@/definitions/auth-schema'
import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { createSession } from '@/lib/session'
import { User } from '@/types/model'

export const loginUser = async (
  body: LoginUserSchemaInfer
): Promise<boolean> => {
  const response = await fetchJson<User>(apiRoute('login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })

  if (response.status === 200 && response.data?.id && response.data?.token) {
    return await createSession(response.data.id.toString(), response.data.token)
  }

  return false
}

export const logoutUser = async (): Promise<string> => {
  const response = await fetchJson<{ message: string }>(apiRoute('login'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  })

    return response.data.message

}
