import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'

export async function GET(context: { params: { id: string } }) {
  const response = await fetchJson(
    apiRoute('option.show', {
      id: context.params.id,
    })
  )

  if (response.status !== 200) {
    throw new Error(
      `Une erreur est survenue lors de la récupèration de l'option #${context.params.id}, merci de réessayer`
    )
  }

  return Response.json(response.data)
}
