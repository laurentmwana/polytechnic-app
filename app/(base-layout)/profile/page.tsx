'use client'

import { Heading } from '@/components/shared/heading'
import { ProfileInfoForm } from './info-form'
import { ProfileUpdatePasswordForm } from './password-form'
import { ProfileDeleteAccount } from './delete-account'
import { ProfileSkeleton } from './profile-skeleton'
import { UnverifiedEmail } from '@/components/shared/unverified-email'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useMe } from '@/hooks/use-me'

export default function MyProfile() {
  const session = useMe()

  if (session.isPending) {
    return <ProfileSkeleton />
  }

  if (!session.user) {
    return (
      <div className="container py-12">
        <Alert>
          <AlertDescription>
            Vous ne pouvez acceder à cette page, merci de vous connecter
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const user = session.user

  return (
    <div className="container py-12">
      <Heading title="Mon profil" />
      <div className="space-y-7">
        <UnverifiedEmail user={user} />

        <ProfileInfoForm name={user.name ?? ''} email={user.email ?? ''} />

        <ProfileUpdatePasswordForm />

        <ProfileDeleteAccount roles={user.roles} />
      </div>
    </div>
  )
}
