import { loginUser } from '@/repositories/auth'
import { findUserMe } from '@/repositories/user'
import { UserLogin, UserMe } from '#/model'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 172800,
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Adresse e-mail',
          type: 'text',
          placeholder: 'email@example.com',
        },
        password: { label: 'Mot de passe', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }

        try {
          const response = await loginUser({
            email: credentials.email,
            password: credentials.password,
          })

          if (response.status === 401) {
            return null
          }

          if (response.status === 422) {
            throw new Error('Erreur de validation')
          }

          if (response.status === 500) {
            throw new Error('Erreur lier au serveur')
          }

          if (!response.ok) {
            return null
          }

          const auth = (await response.json()) as UserLogin

          if (!auth || !auth.access_token) {
            return null
          }

          const userResponse = await findUserMe(auth.access_token)

          if (userResponse.status !== 200) {
            return null
          }

          const dataUserResponse = (await userResponse.json()) as {
            data: UserMe
          }

          return {
            id: String(dataUserResponse.data.id),
            name: dataUserResponse.data.name,
            email: dataUserResponse.data.email,
            accessToken: auth.access_token,
            permissions: dataUserResponse.data.permissions,
            roles: dataUserResponse.data.roles,
            isEmailVerified: dataUserResponse.data.isEmailVerified,
          }
        } catch (error) {
          console.error("Erreur d'authentification :", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.permissions = user.permissions
        token.roles = user.roles
        token.id = user.id
        token.isEmailVerified = user.isEmailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: session.user?.name || '',
          email: session.user?.email || '',
          accessToken: token.accessToken as string,
          permissions: token.permissions || [],
          roles: token.roles || [],
          isEmailVerified: token.isEmailVerified,
        }
      }
      return session
    },
  },
  pages: {
    error: '/auth-error',
  },
  events: {},
  secret: process.env.NEXTAUTH_SECRET,
}
