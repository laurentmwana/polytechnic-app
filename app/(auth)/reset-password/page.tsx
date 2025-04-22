import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ResetPasswordForm } from './reset-form'

const LoginUser = () => {
  return (
    <div>
      <Card className="rounded-xl">
        <CardHeader className="px-10 pt-8 pb-0 text-center">
          <CardTitle className="text-xl">
            Réinitialisation du mot de passe
          </CardTitle>
          <CardDescription>
            Veuillez entrer votre nouveau mot de passe ci-dessous
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 py-8">
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginUser
