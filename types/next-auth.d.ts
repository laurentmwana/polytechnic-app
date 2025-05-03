import type { DefaultSession } from 'next-auth'
import type { UtilModel } from './model'

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
    // Add error property to handle session errors
    error?: string
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
    id?: string
    name?: string
    email?: string
    accessToken?: string
    permissions?: UtilModel[]
    roles?: UtilModel[]
    isEmailVerified?: boolean
    // Add error property to handle token refresh errors
    error?: string
    // Add iat (issued at time) which is used in the refresh logic
    iat?: number
  }
}
