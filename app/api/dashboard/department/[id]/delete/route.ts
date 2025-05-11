import { authOptions } from '@/lib/auth-option'
import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
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

  const response = await fetchJson(
    apiRoute('~department.destroy', { id: context.params.id }),
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (response.status !== 200) {
    throw new Error(
      `Une erreur est survenue lors de la suppression du département #${context.params.id}, merci de réessayer`
    )
  }

  return Response.json(response.data)
}
