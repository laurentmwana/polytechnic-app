import { authOptions } from '@/lib/auth-option'
import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
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

  const searchParams = req.nextUrl.searchParams

  const page = searchParams.get('page') ?? '1'
  const search = searchParams.get('search') ?? ''

  const response = await fetchJson(
    apiRoute('~option.index', { page, search }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (response.status !== 200) {
    throw new Error(
      'Une erreur est survenue lors de la récupèration des options, merci de réessayer'
    )
  }

  return Response.json(response.data)
}
