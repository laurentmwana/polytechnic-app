'use client'

import { PropsWithChildren } from 'react'

export const AdminLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
          <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-5 md:min-h-min">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
