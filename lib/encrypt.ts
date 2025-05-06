"use server"

import { JwtPayload } from '@/types/auth'
import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET

const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: JwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(``)
  }
}
