'use client'

import type React from 'react'
import { SectionPageTitle } from '@/components/shared/section-page'
import { useFetch } from '@/hooks/use-fetch'
import { apiLocalRoute } from '@/lib/route'
import type { News } from '#/model'

export const NewsWelcome = () => {
  const response = useFetch<{ data: News[] }>(
    apiLocalRoute('news.index', { limit: 6 })
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return (
    <div className="container my-12">
      <SectionPageTitle title="Dernier communiqué">
        Nous regroupons plusieurs départements dynamiques, chacun dédié à un
        domaine d&#39;expertise précis. Ensemble, ils forment un pôle de
        compétences solide pour répondre aux défis actuels.
      </SectionPageTitle>

      <div></div>
    </div>
  )
}
