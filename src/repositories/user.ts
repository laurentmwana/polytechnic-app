'use server'

import { apiRoute } from '@/lib/route'

export const findUserMe = async (token: string) => {
  return await fetch(apiRoute('me'), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}
