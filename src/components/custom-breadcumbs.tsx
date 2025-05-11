'use client'

import React from 'react'

import { ChevronRight, Home } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem as UIBreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
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
  const visibleItems =
    items.length <= maxItems ? items : getVisibleItems(items, maxItems)
  const hiddenItems =
    items.length <= maxItems ? [] : getHiddenItems(items, maxItems)

  return (
    <Breadcrumb className={cn('w-full', className)}>
      <BreadcrumbList>
        {/* Home */}
        <UIBreadcrumbItem>
          <BreadcrumbLink href={homeHref}>
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </UIBreadcrumbItem>

        {/* Séparateur */}
        <li aria-hidden="true">{separator}</li>

        {/* Items cachés */}
        {hiddenItems.map((item, index) => (
          <React.Fragment key={index}>
            <UIBreadcrumbItem className="hidden md:inline-flex">
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            </UIBreadcrumbItem>
            <li aria-hidden="true">{separator}</li>
          </React.Fragment>
        ))}

        {/* Items visibles */}
        {visibleItems.map((item, index) => (
          <React.Fragment key={index}>
            <UIBreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </UIBreadcrumbItem>
            {index < visibleItems.length - 1 && (
              <li aria-hidden="true">{separator}</li>
            )}
          </React.Fragment>
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
