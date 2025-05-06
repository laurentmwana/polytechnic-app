'use client'

import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { webRoute } from '@/lib/route'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-5 md:min-h-min">
        <div>
          <div className="mb-4 flex items-center gap-4 justify-between">
            <SearchInput lengthData={4} urlBack={webRoute('dashboard')} />
            <Button size="sm" variant="secondary">
              <Link href="">
                <Plus size={15} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
