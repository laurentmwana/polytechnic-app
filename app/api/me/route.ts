import { UserMe } from '#/model'
import { authOptions } from '@/lib/auth-option'
import { apiRoute } from '@/lib/route'
import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
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

  try {
    const response = await fetch(apiRoute('me'), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const user = (await response.json()) as { data: UserMe }

    return NextResponse.json(user.data, { status: response.status })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'utilisateur" },
      { status: 500 }
    )
  }
}
