import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { NextRequest } from 'next/server'

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const response = await fetchJson(
    apiRoute('year.show', {
      id: params.id,
    })
  )

  if (response.status !== 200) {
    throw new Error(
      `Une erreur est survenue lors de la récupèration de l'année académqiue #${params.id}, merci de réessayer`
    )
  }

  return Response.json(response.data)
}
