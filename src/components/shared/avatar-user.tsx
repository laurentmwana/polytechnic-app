'use client'

import { useState } from 'react'
import { User, LogOut, ListEnd } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { webRoute } from '@/lib/route'
import { isAdmin, isStudent } from '@/lib/role'
import { getInitials } from '@/lib/utils'

export const AvatarDropdown = () => {
  const session = useSession()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut({ redirect: true })
      toast.success('Déconnexion réussie', {
        description: 'Vous avez été déconnecté avec succès.',
      })
    } catch (error: unknown) {
      toast.error('Erreur de déconnexion', {
        description: `Une erreur est survenue lors de la déconnexion : ${error}`,
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (session.status === 'loading') {
    return <Skeleton className="h-9 w-9 rounded-full" />
  }

  if (!session.data) {
    return (
      <Button variant="outline" asChild>
        <Link href={webRoute('login')}>Se connecter</Link>
      </Button>
    )
  }

  const user = session.data.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9 cursor-pointer transition-opacity hover:opacity-80">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <div className="flex items-center justify-start gap-3 p-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent"
          asChild
        >
          <Link href={webRoute('profile')} className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Mon profil</span>
          </Link>
        </DropdownMenuItem>
        {isAdmin(user.role) && (
          <DropdownMenuItem asChild>
            <Link
              href={webRoute('dashboard')}
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent"
            >
              <ListEnd className="h-4 w-4 text-muted-foreground" />
              <span>Tableau de bord</span>
            </Link>
          </DropdownMenuItem>
        )}
        {isStudent(user.role) && (
          <>
            <DropdownMenuItem asChild>
              <Link
                href={webRoute('student-info.index')}
                className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent"
              >
                <ListEnd className="h-4 w-4 text-muted-foreground" />
                <span>Mes informations</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          <span>
            {isLoggingOut ? 'Déconnexion en cours...' : 'Se déconnecter'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
