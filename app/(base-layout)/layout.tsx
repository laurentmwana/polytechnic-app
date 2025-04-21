import { NavbarBase } from '@/components/shared/navbar'
import { PropsWithChildren } from 'react'
import { Toaster } from 'sonner'

const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <NavbarBase />

      <main>{children}</main>

      <Toaster className="w-auto" position="top-center" />
    </div>
  )
}

export default BaseLayout
