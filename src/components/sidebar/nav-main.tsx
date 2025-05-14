'use client'

import { type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

type NavMainItems = {
  title: string
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}

export function NavMain({ items }: { items: NavMainItems[] }) {
  return (
    <SidebarGroup>
      {items.map((menu) => (
        <SidebarGroupContent className="flex flex-col gap-2" key={menu.title}>
          <SidebarGroupLabel></SidebarGroupLabel>
          <SidebarMenu>
            {menu.items.map((item) => {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    tooltip={item.title}
                    asChild
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      ))}
    </SidebarGroup>
  )
}
