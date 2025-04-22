import { NavbarBase } from '@/components/shared/navbar'
import { PropsWithChildren } from 'react'

const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <NavbarBase />
      <main>{children}</main>
    </div>
  )
}

export default BaseLayout
