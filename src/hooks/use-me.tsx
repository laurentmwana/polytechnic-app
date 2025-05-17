import { UserMe } from '#/model'
import { apiLocalRoute } from '@/lib/route'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useMe = () => {
  const [isPending, setIsPending] = useState<boolean>(false)
  const [user, setUser] = useState<UserMe | null>(null)
  const { status } = useSession()

  useEffect(() => {
    let isMounted = true

    const getUser = async () => {
      setIsPending(true)
      try {
        const response = await fetch(apiLocalRoute('me'))

        if (!response.ok) {
          if (isMounted) {
            await signOut({ redirect: true })
            setUser(null)
          }
        } else {
          const data: UserMe = await response.json()
          if (isMounted) setUser(data)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setIsPending(false)
      }
    }

    if (status === 'loading') {
      // Session est en cours de chargement, ne rien faire pour l'instant
      return
    }

    if (status === 'authenticated') {
      getUser()
    } else {
      // Pas authentifié, on remet user à null
      setUser(null)
    }

    return () => {
      isMounted = false
    }
  }, [status])

  return {
    user,
    isPending,
  }
}
