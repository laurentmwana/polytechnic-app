import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

type BreadcrumbsHeaderProps = {
  items: { title: string; href: string }[]
}

export function BreadcrumbsHeader({ items }: BreadcrumbsHeaderProps) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Responsive breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            {items.length > 0 && (
              <>
                {/* On small screens, only show the last item */}
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <BreadcrumbLink asChild>
                    <Link href={items[0].href}>{items[0].title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:inline-flex">
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>

                {/* On medium screens, show more items */}
                {items.length > 2 &&
                  items.slice(1, -1).map((item, index) => (
                    <BreadcrumbItem
                      key={index}
                      className="hidden md:inline-flex"
                    >
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.title}</Link>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                    </BreadcrumbItem>
                  ))}

                {/* Always show the last item */}
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">
                    {items[items.length - 1].title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
