import { BaseLayout } from '@/layouts/base-layout'
import { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <BaseLayout>
      <main>{children}</main>
    </BaseLayout>
  )
}

export default Layout
