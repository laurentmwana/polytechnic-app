'use client'

import { useState } from 'react'
import { User, Calendar, LogOut, Settings } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

export const AvatarDropdown = () => {
  const { data: session, status } = useSession()

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

  // Extraire les initiales du nom d'utilisateur
  const getInitials = () => {
    if (!session?.user?.name) return 'UN'
    return session.user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Afficher un skeleton loader pendant le chargement
  if (status === 'loading') {
    return <Skeleton className="h-9 w-9 rounded-full" />
  }

  if (status === 'unauthenticated') {
    return (
      <Button variant="outline" asChild>
        <Link href={webRoute('login')}>Se connecter</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9 cursor-pointer transition-opacity hover:opacity-80">
            <AvatarImage
              src={
                session?.user?.image || '/placeholder.svg?height=36&width=36'
              }
              alt={session?.user?.name || 'Avatar'}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <div className="flex items-center justify-start gap-3 p-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={
                session?.user?.image || '/placeholder.svg?height=40&width=40'
              }
              alt={session?.user?.name || 'Avatar'}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm">
              {session?.user?.name || 'Utilisateur'}
            </p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.email || 'utilisateur@exemple.com'}
            </p>
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
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Évènements</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span>Paramètres</span>
        </DropdownMenuItem>
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
