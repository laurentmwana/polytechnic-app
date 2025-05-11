'use client'

import { BreadcrumbsHeader } from '@/components/sidebar/breadcrumb-header'
import { AdminLayout } from '@/layouts/admin-layout'
import { webRoute } from '@/lib/route'

const items = [
  {
    title: 'Tableau de bord',
    href: webRoute('dashboard'),
  },
  {
    title: 'Départements',
    href: '#',
  },
]

export default function Page() {
  return (
    <>
      <BreadcrumbsHeader items={items} />
      <AdminLayout></AdminLayout>
    </>
  )
}
