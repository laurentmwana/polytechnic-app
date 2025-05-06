import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { isAdmin } from '@/lib/role'
import { UtilModel } from '@/types/model'

interface ProfileDeleteAccountProps {
  roles: UtilModel[]
}

export const ProfileDeleteAccount = ({ roles }: ProfileDeleteAccountProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-3">Suppression du compte</CardTitle>
        <CardDescription>
          {isAdmin(roles)
            ? 'Vous ne pouvez pas supprimer ce compte car vous êtes administrateur.'
            : 'Vous ne pouvez pas supprimer votre compte, vous devez faire une demande à l’administrateur.'}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
