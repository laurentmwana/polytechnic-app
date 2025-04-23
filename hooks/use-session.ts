import { SESSION_ID } from '@/constants/authorization'
import { cookies } from 'next/headers'

export const useSession = async () => {
  const cookieStore = await cookies()
  const cookieData = cookieStore.get(SESSION_ID)?.value

  if (!cookieData) {
    return null
  }
}
