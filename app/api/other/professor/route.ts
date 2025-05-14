import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'

export const GET = async () => {
  const response = await fetchJson(apiRoute('professor.index'))

  if (response.status !== 200) {
    throw new Error('Une erreur est survenue, merci de réessayer')
  }

  return Response.json(response.data)
}
