'use client'

import { Button } from '@/components/ui/button'
import { TextLink } from '@/components/shared/text-link'
import { UserCircle } from 'lucide-react'
import type { User } from '@/types/model'
import { logoutUser } from '@/actions/auth'
import { useState } from 'react'
import { Loader } from '@/components/ui/loader'
import { toast } from 'sonner'
import { webRoute } from '@/lib/route'
import { useRouter } from 'next/navigation'

interface UserInfoProps {
  user: User
}

export const UserInfo = ({ user }: UserInfoProps) => {
  const router = useRouter()

  const [isLogout, setIsLogout] = useState<boolean>(false)

  const onLogout = async () => {
    setIsLogout(true)

    try {
      const response = await logoutUser(user.token)

      toast.warning('Action', {
        description: response.data.message,
      })

      router.push(webRoute('welcome'))

      setIsLogout(false)
      
    } catch (error) {
      toast.error('Erreur', {
        description: error as string,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <UserCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium">{user.name || 'Utilisateur'}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Button asChild className="w-full">
          <TextLink href="/dashboard">Accéder au tableau de bord</TextLink>
        </Button>
        <Button
          disabled={isLogout}
          onClick={onLogout}
          variant="outline"
          className="w-full"
        >
          {isLogout ? <Loader /> : 'Se déconnecter'}
        </Button>
      </div>
    </div>
  )
}
