import { loginUser } from '@/repositories/auth.repo'
import { findUserMe } from '@/repositories/user.repo'
import { UserLogin } from '@/types/model'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
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

          return {
            id: String(userResponse.data.id),
            name: userResponse.data.name,
            email: userResponse.data.email,
            accessToken: auth.access_token,
            permissions: userResponse.data.permissions,
            roles: userResponse.data.roles,
            isEmailVerified: userResponse.data.isEmailVerified,
          }
        } catch (error) {
          console.error("Erreur d'authentification :", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    // Stocker le token JWT et infos utilisateur dans le token
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
    // Transmettre les infos stockées dans le token à la session côté client
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
    error: '/auth-error', // Page d’erreur personnalisée
  },
  secret: process.env.NEXTAUTH_SECRET,
}
