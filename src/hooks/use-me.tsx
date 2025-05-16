import { UserMe } from '#/model'
import { apiLocalRoute } from '@/lib/route'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useMe = () => {
  const [isPending, setIsPending] = useState<boolean>(false)
  const [user, setUser] = useState<UserMe | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsPending(true)

    const getUser = async () => {
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

    getUser()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    user,
    isPending,
  }
}
