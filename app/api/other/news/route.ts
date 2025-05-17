import { ApiResponse } from '#/fetch'
import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams

  const limit = searchParams.get('limit')

  const page = searchParams.get('page') ?? '1'
  const search = searchParams.get('search') ?? ''

  let response: ApiResponse<unknown>

  if (limit) {
    response = await fetchJson(
      apiRoute('news.index', {
        limit,
      })
    )
  } else {
    response = await fetchJson(apiRoute('news.index', { page, search }))
  }

  if (response.status !== 200) {
    throw new Error(
      'Une erreur est survenue lors de la récupèration des news, merci de réessayer'
    )
  }

  return Response.json(response.data)
}
