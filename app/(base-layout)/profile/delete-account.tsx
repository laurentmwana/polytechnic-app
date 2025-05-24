import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { isAdmin } from '@/lib/role'

interface ProfileDeleteAccountProps {
  role: string
}

export const ProfileDeleteAccount = ({ role }: ProfileDeleteAccountProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-3">Suppression du compte</CardTitle>
        <CardDescription>
          {isAdmin(role)
            ? 'Vous ne pouvez pas supprimer ce compte car vous êtes administrateur.'
            : 'Vous ne pouvez pas supprimer votre compte, vous devez faire une demande à l’administrateur.'}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
