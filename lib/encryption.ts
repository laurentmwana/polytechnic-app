import { SignJWT, jwtVerify } from 'jose'

type SessionPayload = {
  userId: string
  token: string
  role?: string
  exp?: number // optionnel, géré par jose
  iat?: number
}

const secretKey = process.env.SESSION_SECRET

if (!secretKey) throw new Error('SESSION_SECRET is not set')

const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: Omit<SessionPayload, 'exp' | 'iat'>) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(
  session: string | undefined = ''
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as SessionPayload
  } catch (error) {
    console.error('Session verification failed:', error)
    return null
  }
}
