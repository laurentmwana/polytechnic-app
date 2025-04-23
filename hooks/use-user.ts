'use client'

import { getUser } from '@/repositories/user.repo'
import type { User } from '@/types/model'
import { useEffect, useState } from 'react'

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const getAuth = async () => {
      try {
        setIsLoading(true)
        const userData = await getUser()

        if (isMounted) {
          setUser(userData)
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error('Failed to fetch user')
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    getAuth()

    return () => {
      isMounted = false
    }
  }, [])

  return { user, isLoading, error }
}
