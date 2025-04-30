'use server'

import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { UserMe } from '@/types/model'

export const findUserMe = async (token: string) => {
  return await fetchJson<UserMe>(apiRoute('me'), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}
