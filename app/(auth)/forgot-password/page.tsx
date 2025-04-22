import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TextLink } from '@/components/shared/text-link'
import { ForgotPasswordForm } from './forgot-form'

const ForgotPassword = () => {
  return (
    <div>
      <Card className="rounded-xl">
        <CardHeader className="px-10 pt-8 pb-0 text-center">
          <CardTitle className="text-xl">Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre e-mail pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 py-8">
          <ForgotPasswordForm />

          <div className="text-muted-foreground space-x-1 text-center text-sm">
            <span>Ou, retour </span>
            <TextLink href="/login">à la connexion</TextLink>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword
