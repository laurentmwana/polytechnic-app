'use server'

import { cookies } from 'next/headers'
import { decrypt, encrypt } from './encrypt'

export const createSession = async (token: string): Promise<boolean> => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ token, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })

  return true
}

export const getSession = async (): Promise<{ token: string } | null> => {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value

    const payload = await decrypt(session)

    if (!session || !payload) return null

    return {
      token: payload.token as string,
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export const removeSession = async (): Promise<boolean> => {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('session')

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}
