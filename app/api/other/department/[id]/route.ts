import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const id = (await context.params).id

  const response = await fetchJson(
    apiRoute('department.show', {
      id,
    })
  )

  if (response.status !== 200) {
    throw new Error(
      `Une erreur est survenue lors de la récupèration du départment #${id}, merci de réessayer`
    )
  }

  return Response.json(response.data)
}
