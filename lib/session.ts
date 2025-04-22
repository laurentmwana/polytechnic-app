import 'server-only'
import { cookies } from 'next/headers'
import { encrypt } from './encryption'

export async function createSession(userId: string, token: string) {
  const maxAge = 7 * 24 * 60 * 60
  const session = await encrypt({ userId, token })

  const cookieStore = await cookies()

  cookieStore.set({
    name: 'session',
    value: session,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge,
    sameSite: 'lax',
    path: '/',
  })

  return true
}
