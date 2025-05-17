import { Notification } from '#/model'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useNotification = (url: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isPending, setIsPending] = useState<boolean>(false)

  const session = useSession()

  useEffect(() => {
    const getNotifications = async () => {
      setIsPending(true)
      try {
        const response = await fetch(url, {
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          setNotifications([])
        } else {
          const result = (await response.json()) as { data: Notification[] }
          setNotifications(result.data)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setNotifications([])
      } finally {
        setIsPending(false)
      }
    }

    if (session.status === 'authenticated') {
      getNotifications()
    } else {
      setNotifications([])
    }
  }, [session.status, url])

  return {
    notifications,
    isPending,
  }
}
