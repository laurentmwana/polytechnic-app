'use server'

import { SESSION_ID } from '@/constants/authorization'
import { decrypt } from '@/lib/encryption'
import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import type { User } from '@/types/model'
import { cookies } from 'next/headers'

export const getUser = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies()

    const sessionCookie = cookieStore.get(SESSION_ID)?.value

    if (!sessionCookie) return null

    const session = await decrypt(sessionCookie)

    if (!session) return null

    const response = await fetchJson<User>(apiRoute('me'), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`,
      },
    })

    return response.data ?? null
  } catch (error) {
    console.error('Error fetching connected user:', error)
    return null
  }
}
