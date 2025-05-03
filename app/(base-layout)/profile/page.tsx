'use client'

import { Heading } from '@/components/shared/heading'
import { ProfileInfoForm } from './info-form'
import { ProfileUpdatePasswordForm } from './password-form'
import { ProfileDeleteAccount } from './delete-account'
import { useSession } from 'next-auth/react'
import { ProfileSkeleton } from './profile-skeleton'
import { UnverifiedEmail } from '@/components/shared/unverified-email'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useEffect, useRef } from 'react'

export default function MyProfile() {
  const { data: session, status, update } = useSession()
  // Use a ref to track if we've already updated the session
  const hasUpdatedRef = useRef(false)

  // Use useEffect with an empty dependency array to run only once when the component mounts
  useEffect(() => {
    // Only update if we have a session and haven't updated yet
    if (status === 'authenticated' && !hasUpdatedRef.current) {
      // Mark that we've started the update to prevent multiple calls
      hasUpdatedRef.current = true

      // Use a void function to handle the promise without blocking
      const refreshSession = async () => {
        try {
          await update()
        } catch (error) {
          console.error('Failed to update session:', error)
        }
      }

      refreshSession()
    }
  }, [status, update]) // Empty dependency array ensures this only runs once on mount

  if (status === 'loading') {
    return <ProfileSkeleton />
  }

  if (!session) {
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
        <ProfileInfoForm
          name={user.name ?? ''}
          email={user.email ?? ''}
          token={user.accessToken ?? ''}
          update={update}
        />

        <ProfileUpdatePasswordForm />

        <ProfileDeleteAccount roles={user.roles} />
      </div>
    </div>
  )
}
