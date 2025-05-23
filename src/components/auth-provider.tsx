'use client'

import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren } from 'react'

export const SessionNextAuthProvider = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>
  )
}