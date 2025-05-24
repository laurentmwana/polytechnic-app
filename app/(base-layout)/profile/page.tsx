'use client'

import { Heading } from '@/components/shared/heading'
import { ProfileInfoForm } from './info-form'
import { ProfileUpdatePasswordForm } from './password-form'
import { ProfileDeleteAccount } from './delete-account'
import { ProfileSkeleton } from './profile-skeleton'
import { UnverifiedEmail } from '@/components/shared/unverified-email'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSession } from 'next-auth/react'

export default function MyProfile() {
  const session = useSession()

  if (session.status === 'loading') {
    return <ProfileSkeleton />
  }

  if (!session.data) {
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

  const user = session.data.user

  return (
    <div className="container py-12">
      <Heading title="Mon profil" />
      <div className="space-y-7">
        <UnverifiedEmail user={user} />

        <ProfileInfoForm name={user.name ?? ''} email={user.email ?? ''} />

        <ProfileUpdatePasswordForm />

        <ProfileDeleteAccount role={user.role} />
      </div>
    </div>
  )
}
