import { loginUser } from '@/repositories/auth'
import { findUserMe } from '@/repositories/user'
import type { UserLogin } from '@/types/model'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { JWT } from 'next-auth/jwt'

// Function to fetch updated user data
const getUser = async (token: string) => {
  try {
    const response = await findUserMe(token)

    if (!response || response.status >= 400) {
      return null
    }

    return {
      id: String(response.data.id),
      name: response.data.name,
      email: response.data.email,
      accessToken: token,
      permissions: response.data.permissions,
      roles: response.data.roles,
      isEmailVerified: response.data.isEmailVerified,
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

// Function to refresh user data in the token
const refreshUserData = async (token: JWT): Promise<JWT> => {
  if (!token.accessToken) return token

  try {
    const userData = await getUser(token.accessToken as string)

    if (!userData) {
      // If user data can't be fetched, the token might be invalid
      return { ...token, error: 'RefreshAccessTokenError' }
    }

    // Update token with fresh user data
    return {
      ...token,
      id: userData.id,
      name: userData.name,
      email: userData.email,
      permissions: userData.permissions,
      roles: userData.roles,
      isEmailVerified: userData.isEmailVerified,
    }
  } catch (error) {
    console.error('Error refreshing user data:', error)
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
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

          return getUser(auth.access_token)
        } catch (error) {
          console.error("Erreur d'authentification :", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    // Store JWT token and user info in the token
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          permissions: user.permissions,
          roles: user.roles,
          id: user.id,
          isEmailVerified: user.isEmailVerified,
        }
      }

      // Handle token refresh on each request
      if (
        trigger === 'update' ||
        Date.now() > (token.iat || 0) * 1000 + 5 * 60 * 1000
      ) {
        return refreshUserData(token)
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
          isEmailVerified: token.isEmailVerified as boolean,
        }
        if (token.error) {
          session.error = token.error as string
        }
      }
      return session
    },
  },
  pages: {
    error: '/auth-error', // Custom error page
    signIn: '/login',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
