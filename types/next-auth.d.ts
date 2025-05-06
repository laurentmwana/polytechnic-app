import { DefaultSession } from 'next-auth'
import { UtilModel } from './model'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      accessToken: string
      permissions: UtilModel[]
      roles: UtilModel[]
      isEmailVerified: boolean
    } & DefaultSession['user']
  }

  interface User {
    id: string
    name: string
    email: string
    accessToken: string
    permissions: UtilModel[]
    roles: UtilModel[]
    isEmailVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    name: string
    email: string
    accessToken: string
    permissions: UtilModel[]
    roles: UtilModel[]
    isEmailVerified: boolean
  }
}
