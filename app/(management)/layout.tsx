'use client'

import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
