import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { User } from '@/types/model'

export const getUserConnected = async (token: string): Promise<User | null> => {
  const response = fetchJson<User>(apiRoute('me'), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return (await response).data ?? null
}
