import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { NextRequest } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async (request: NextRequest) => {
  const response = await fetchJson(apiRoute('eva.index'))

  if (response.status !== 200) {
    throw new Error(
      'Une erreur est survenue lors de la récupèration des évaluations, merci de réessayer'
    )
  }

  return Response.json(response.data)
}
