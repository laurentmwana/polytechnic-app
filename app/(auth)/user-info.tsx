'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserCircle, LogOut, LayoutDashboard } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { TextLink } from '@/components/shared/text-link'
import { Loader } from '@/components/ui/loader'
import { logoutUser } from '@/repositories/auth.repo'
import { webRoute } from '@/lib/route'
import type { UserMe } from '@/types/model'

interface UserInfoProps {
  user: UserMe
}

export const UserInfo = ({ user }: UserInfoProps) => {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const response = await logoutUser(user.accessToken)

      toast.warning('Déconnexion', {
        description:
          response.data.message || 'Vous avez été déconnecté avec succès.',
      })

      router.push(webRoute('welcome'))
    } catch (error: unknown) {
      toast.error('Erreur', {
        description:
          (error as { message: string })?.message ||
          'Une erreur est survenue lors de la déconnexion.',
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary/10">
          <UserCircle className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold tracking-tight">
            {user.name || 'Utilisateur'}
          </h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <Button asChild className="w-full gap-2 font-medium">
          <TextLink href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Accéder au tableau de bord
          </TextLink>
        </Button>
        <Button
          variant="outline"
          className="w-full gap-2 font-medium transition-colors hover:bg-destructive/10 hover:text-destructive"
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          {isLoggingOut ? (
            <Loader className="h-4 w-4" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          {isLoggingOut ? 'Déconnexion en cours...' : 'Se déconnecter'}
        </Button>
      </div>
    </div>
  )
}
