import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      accessToken: string
      role: string
      isEmailVerified: boolean
    } & DefaultSession['user']
  }

  interface User {
    id: string
    name: string
    email: string
    accessToken: string
    role: string
    isEmailVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    name: string
    email: string
    accessToken: string
    role: string
    isEmailVerified: boolean
  }
}
