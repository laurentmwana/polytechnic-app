import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams

  const page = searchParams.get('page') ?? '1'
  const search = searchParams.get('search') ?? ''

  const response = await fetchJson(
    apiRoute('programme.index', { page, search })
  )

  if (response.status !== 200) {
    throw new Error(
      'Une erreur est survenue lors de la récupèration des programmes, merci de réessayer'
    )
  }

  return Response.json(response.data)
}
