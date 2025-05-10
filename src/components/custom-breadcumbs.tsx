'use client'

import type React from 'react'

import { ChevronRight, Home, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem as UIBreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href: string
  isCurrent?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  homeHref?: string
  className?: string
  separator?: React.ReactNode
  maxItems?: number
}

export function CustomBreadcrumbs({
  items,
  homeHref = '/',
  className,
  separator = <ChevronRight className="h-4 w-4" />,
  maxItems = 3,
}: BreadcrumbsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const visibleItems =
    items.length <= maxItems ? items : getVisibleItems(items, maxItems)
  const hiddenItems =
    items.length <= maxItems ? [] : getHiddenItems(items, maxItems)

  return (
    <Breadcrumb className={cn('w-full', className)}>
      <BreadcrumbList>
        {/* Icône Home toujours visible */}
        <UIBreadcrumbItem>
          <BreadcrumbLink href={homeHref} aria-label="Accueil">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </UIBreadcrumbItem>
        <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>

        {/* Menu déroulant pour les éléments cachés sur mobile */}
        {hiddenItems.length > 0 && (
          <>
            <UIBreadcrumbItem className="md:hidden">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hiddenItems.map((item, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <Link href={item.href} prefetch>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </UIBreadcrumbItem>
            <BreadcrumbSeparator className="md:hidden">
              {separator}
            </BreadcrumbSeparator>

            {/* Éléments cachés sur mobile mais visibles sur desktop */}
            {hiddenItems.map((item, index) => (
              <UIBreadcrumbItem key={index} className="hidden md:inline-flex">
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              </UIBreadcrumbItem>
            ))}
          </>
        )}

        {/* Éléments toujours visibles */}
        {visibleItems.map((item, index) => (
          <UIBreadcrumbItem key={index}>
            {item.isCurrent ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            )}
            {index < visibleItems.length - 1 && (
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            )}
          </UIBreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function getVisibleItems(
  items: BreadcrumbItem[],
  maxItems: number
): BreadcrumbItem[] {
  // Toujours afficher le dernier élément (page courante)
  if (items.length <= maxItems) return items

  return [items[items.length - 1]]
}

function getHiddenItems(
  items: BreadcrumbItem[],
  maxItems: number
): BreadcrumbItem[] {
  if (items.length <= maxItems) return []

  return items.slice(0, items.length - 1)
}
