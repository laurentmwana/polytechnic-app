import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RegisterUserForm } from './register-form'
import { TextLink } from '@/components/shared/text-link'

const RegisterUser = () => {
  return (
    <div>
      <Card className="rounded-xl">
        <CardHeader className="px-10 pt-8 pb-0 text-center">
          <CardTitle className="text-xl">Créer un compte</CardTitle>
          <CardDescription>
            Entrez vos informations ci-dessous pour créer votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 py-8">
          <RegisterUserForm />

          <div className="text-muted-foreground text-center text-sm mt-6">
            Vous avez déjà un compte ?{' '}
            <TextLink href="/login" tabIndex={6}>
              Connectez-vous
            </TextLink>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterUser
