'use client'

import { Heading } from '@/components/shared/heading'
import { ProfileInfoForm } from './info-form'
import { ProfileUpdatePasswordForm } from './password-form'
import { ProfileDeleteAccount } from './delete-account'
import { useSession } from 'next-auth/react'
import { ProfileSkeleton } from './profile-skeleton'
import { UnverifiedEmail } from '@/components/shared/unverified-email'

export default function MyProfile() {
  const session = useSession()

  return (
    <div className="container py-12">
      <Heading title="Mon profil" />

      {session.status === 'loading' ? (
        <ProfileSkeleton />
      ) : (
        <div className="space-y-7">
          <UnverifiedEmail user={session.data?.user} />
          <ProfileInfoForm
            name={session.data?.user.name ?? ''}
            email={session.data?.user.email ?? ''}
          />

          <ProfileUpdatePasswordForm />

          <ProfileDeleteAccount />
        </div>
      )}
    </div>
  )
}
