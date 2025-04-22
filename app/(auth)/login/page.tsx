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

const LoginUser = () => {
  return (
    <div>
      <Card className="rounded-xl">
        <CardHeader className="px-10 pt-8 pb-0 text-center">
          <CardTitle className="text-xl">
            Connectez-vous à votre compte
          </CardTitle>
          <CardDescription>
            Entrez votre e-mail et mot de passe ci-dessous pour vous connecter
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 py-8">
          <LoginUserForm />

          <div className="text-muted-foreground text-center text-sm mt-3">
            Vous n&#39;avez pas de compte ?{' '}
            <TextLink href="/register" tabIndex={5}>
              Inscrivez-vous
            </TextLink>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginUser
