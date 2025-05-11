import { authOptions } from '@/lib/auth-option'
import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Vous n'êtes pas connecté" },
      { status: 401 }
    )
  }

  const accessToken = session.user?.accessToken

  if (!accessToken) {
    return NextResponse.json(
      { error: "Token d'accès manquant" },
      { status: 401 }
    )
  }

  const formData = await req.json()

  const response = await fetchJson(
    apiRoute('~level.destroy', { id: params.id }),
    {
      method: 'DELETE',
      body: formData,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (response.status !== 200) {
    throw new Error(
      `Une erreur est survenue lors de la suppression du programme #${params.id}, merci de réessayer`
    )
  }

  return Response.json(response.data)
}
