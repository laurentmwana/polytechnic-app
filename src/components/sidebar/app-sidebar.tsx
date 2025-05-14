'use client'

import * as React from 'react'
import { LayoutDashboardIcon, ListIcon, OptionIcon } from 'lucide-react'

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

const items = [
  {
    title: "Edifice",
    items: [
        {
    title: 'Tableau de bord',
    url: webRoute('dashboard'),
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Département',
    url: webRoute('~department.index'),
    icon: ListIcon,
  },
  {
    title: 'Option',
    url: webRoute('~option.index'),
    icon: OptionIcon,
  },
    ]
  }
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
              <a href={webRoute('dashboard')}>
                <span className="text-base font-semibold">PolyTechnique</span>
              </a>
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
