'use client'

import * as React from 'react'
import { LayoutDashboardIcon, MoveDownIcon, OptionIcon } from 'lucide-react'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { webRoute } from '@/lib/route'
import Link from 'next/link'

const items = [
  {
    title: 'Application',
    items: [
      {
        title: 'Tableau de bord',
        url: webRoute('dashboard'),
        icon: LayoutDashboardIcon,
      },
    ],
  },
  {
    title: 'Edifice',
    items: [
      {
        title: 'Option',
        url: webRoute('~option.index'),
        icon: OptionIcon,
      },

      {
        title: 'Promotion',
        url: '',
        icon: MoveDownIcon,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={webRoute('dashboard')}>
                <span className="text-base font-semibold">PolyTechnique</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
