'use server'

import { LoginUserSchemaInfer } from '@/definitions/auth-schema'
import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { createSession } from '@/lib/session'
import { User } from '@/types/model'

export const loginUser = async (data: LoginUserSchemaInfer) => {
  const response = await fetchJson<User>(apiRoute('login'), {
    method: 'POST',
    body: data,
  })

  if (response.status === 200) {
    return await createSession(response.data.id, response.data.token)
  }

  return false
}
