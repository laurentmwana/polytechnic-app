'use client'

import { useSession } from 'next-auth/react'
import { VerifyEmailForm } from './verify-email-form'
import { LoadingState } from './loading-state'
import { RestrictedAccess } from './restricted-access'
import { AlreadyVerified } from './already-verified'

export default function VerifyEmailPage() {
  const session = useSession()

  // Loading state
  if (session.status === 'loading') {
    return <LoadingState />
  }

  // Not logged in
  if (!session || !session.data?.user) {
    return <RestrictedAccess />
  }

  const user = session.data.user

  // Already verified
  if (user.isEmailVerified) {
    return <AlreadyVerified />
  }

  return (
    <VerifyEmailForm
      updateInformation={(v) => {
        session.update({
          isEmailVerified: v,
        })
      }}
      user={user}
    />
  )
}
