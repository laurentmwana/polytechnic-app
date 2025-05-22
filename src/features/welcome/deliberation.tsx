'use client'

import { useState, useEffect } from 'react'
import { apiRoute } from '@/lib/route'
import type { News } from '#/model'
import { NewsCarousel } from '../news/news-carousel'

export const DelibertionWelcome = () => {
  const [news, setNews] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          apiRoute('deliberation.index', { limit: 6 }),
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
          }
        )
        if (!response.ok)
          setError('Erreur lors de la récupération des nouvelles')
        const data = await response.json()
        setNews(data.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }
    fetchNews()
  }, [])

  if (error) {
    console.error(error)
    return <NewsCarousel news={[]} isLoading={false} />
  }

  return <NewsCarousel news={news} isLoading={isLoading} />
}
