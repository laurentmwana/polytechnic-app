'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginUserForm } from './login-form'
import { TextLink } from '@/components/shared/text-link'
import { useUser } from '@/hooks/use-user'
import { UserInfo } from '#/user/user-info'
import { UserSkeleton } from '#/user/user-skeleton'

const LoginUser = () => {
  const { user, error, isLoading } = useUser()

  return (
    <div>
      <Card className="rounded-xl">
        <CardHeader className="px-10 pt-8 pb-0 text-center">
          <CardTitle className="text-xl">
            {isLoading
              ? 'Chargement...'
              : user
              ? 'Vous êtes connecté'
              : 'Connectez-vous à votre compte'}
          </CardTitle>
          <CardDescription>
            {isLoading
              ? 'Vérification de votre session...'
              : user
              ? 'Voici vos informations de compte'
              : 'Entrez votre e-mail et mot de passe ci-dessous pour vous connecter'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 py-8">
          {isLoading ? (
            <UserSkeleton />
          ) : user ? (
            <UserInfo user={user} />
          ) : (
            <>
              <LoginUserForm />
              <div className="text-muted-foreground text-center text-sm mt-3">
                Vous n&#39;avez pas de compte ?{' '}
                <TextLink href="/register" tabIndex={5}>
                  Inscrivez-vous
                </TextLink>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginUser
