'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

const query = new QueryClient()

export const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={query}>{children}</QueryClientProvider>
}
