import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { apiRoute } from './route'
import { UserMe } from '#/model'

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
          const response = await fetch(apiRoute('login'), {
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })

          const data = await response.json()

          if (response.ok) {
            const user = (data as { data: UserMe }).data

            return {
              id: String(user.id),
              name: user.name,
              email: user.email,
              accessToken: user.accessToken,
              role: user.role,
              isEmailVerified: user.isEmailVerified,
            }
          }

          return null
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
        token.role = user.role
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
          role: token.role,
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
