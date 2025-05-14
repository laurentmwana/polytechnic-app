import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'

export const GET = async () => {
  const response = await fetchJson(apiRoute('year.pending'))

  if (response.status !== 200) {
    throw new Error(
      `Une erreur est survenue lors de la récupèration de l'année académqiue en cours, merci de réessayer`
    )
  }

  return Response.json(response.data)
}
