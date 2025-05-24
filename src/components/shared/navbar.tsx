'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from '../themes/theme-toggle'
import { AvatarDropdown } from './avatar-user'
import { AppLogoIcon } from './logo'
import { webRoute } from '@/lib/route'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { isStudent } from '@/lib/role'

type NavItem = {
  label: string
  href?: string
  children?: NavItem[]
}

export const NavbarBase = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const session = useSession()

  // Navigation items with dropdown support
  const navItems: NavItem[] = [
    { label: 'Accueil', href: '/' },
    { label: 'A propos', href: '/about' },
    {
      label: 'Académique',
      children: [
        { label: 'Départments', href: '/department' },
        { label: 'Filières', href: '/option' },
        { label: 'Promotion', href: '/level' },
        { label: 'Programme', href: '/programme' },
        { label: 'Année académique', href: '/year-academic' },
        { label: 'Professeurs', href: '/professor' },
      ],
    },
    { label: 'Délibération', href: '/deliberation' },
    {
      label: 'Paiement',
      children: [
        { label: 'Laboratoire', href: '/laboratory-fees' },
        { label: 'Académique', href: '/academic-fees' },
      ],
    },
    ...(session.status === 'authenticated' && isStudent(session.data.user.role)
      ? [
          {
            label: 'Moi',
            children: [
              { label: 'Mon coupon', href: '/my-deliberation' },
              { label: 'Laboratoire', href: '/payment/laboratory' },
              { label: 'Académique', href: '/payment/academic' },
            ],
          },
        ]
      : []),
    { label: 'Contact', href: '/contact-us' },
  ]

  const isActive = (href?: string) => {
    if (!href) return false
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <nav className="bg-background/95 border-border sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto px-5 max-w-6xl">
        <div className="flex items-center justify-between py-4">
          <Link href={webRoute('login')} className="flex items-center">
            <AppLogoIcon />
          </Link>

          {/* Desktop Menu with Dropdown Support */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => {
                  // If the item has children, render a dropdown
                  if (item.children) {
                    return (
                      <NavigationMenuItem key={item.label}>
                        <NavigationMenuTrigger
                          className={cn(
                            isActive(item.href) &&
                              'bg-accent text-accent-foreground font-semibold'
                          )}
                        >
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[200px] gap-1 p-2">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={child.href || '#'}
                                    className={cn(
                                      'block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                      isActive(child.href) &&
                                        'bg-accent text-accent-foreground font-semibold'
                                    )}
                                  >
                                    {child.label}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    )
                  }
                  // If the item doesn't have children, render a simple link
                  return (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuLink
                        href={item.href || '#'}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          isActive(item.href) &&
                            'bg-accent text-accent-foreground font-semibold'
                        )}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <AvatarDropdown />
            </div>

            {/* Mobile Menu Sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="secondary" size="icon">
                  <Menu size={24} />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col">
                  {navItems.map((item) => {
                    // If the item has children, render an accordion in mobile view
                    if (item.children) {
                      return (
                        <Accordion type="single" collapsible key={item.label}>
                          <AccordionItem
                            value={item.label}
                            className="border-none"
                          >
                            <AccordionTrigger className="py-2.5 px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:no-underline rounded-md">
                              {item.label}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col space-y-1 pl-4">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.label}
                                    href={child.href || '#'}
                                    onClick={handleLinkClick}
                                    className={cn(
                                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                      isActive(child.href)
                                        ? 'bg-accent text-accent-foreground font-semibold'
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                    )}
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )
                    }

                    // If the item doesn't have children, render a simple link
                    return (
                      <Link
                        key={item.label}
                        href={item.href || '#'}
                        onClick={handleLinkClick}
                        className={cn(
                          'rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive(item.href)
                            ? 'bg-accent text-accent-foreground font-semibold'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
