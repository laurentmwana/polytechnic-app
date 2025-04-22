import Link from 'next/link'
import { PropsWithChildren } from 'react'

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-8">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-9 w-9 items-center justify-center"></div>
        </Link>

        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
