'use client'

import type React from 'react'
import { useFetch } from '@/hooks/use-fetch'
import { apiLocalRoute } from '@/lib/route'
import type { News } from '#/model'
import { NewsCarousel } from '../news/news-carousel'

export const NewsWelcome = () => {
  const response = useFetch<{ data: News[] }>(
    apiLocalRoute('news.index', { limit: 6 })
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return (
    <NewsCarousel news={response.result?.data} isLoading={response.isLoading} />
  )
}
