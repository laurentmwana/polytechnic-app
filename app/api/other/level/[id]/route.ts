import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'

export const GET = async (
  request: Request,
  context: { params: Promise<{ id: string }> }
) => {
  const id = (await context.params).id

  const response = await fetchJson(
    apiRoute('level.show', {
      id,
    })
  )

  if (response.status !== 200) {
    throw new Error(
      `Une erreur est survenue lors de la récupèration de la promotion #${id}, merci de réessayer`
    )
  }

  return Response.json(response.data)
}
