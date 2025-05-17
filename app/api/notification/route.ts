import { authOptions } from '@/lib/auth-option'
import { apiRoute } from '@/lib/route'
import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'

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

  const searchParams = request.nextUrl.searchParams

  const limit = searchParams.get('limit')

  try {
    if (limit && limit.length > 0) {
      const response = await fetch(apiRoute('notification.index', { limit }), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      })

      return await getResponse(response)
    } else {
      const response = await fetch(apiRoute('notification.index'), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      })

      return await getResponse(response)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des notifiction' },
      { status: 500 }
    )
  }
}

async function getResponse(response: Response) {
  const notification = (await response.json()) as { data: object[] }

  return NextResponse.json(notification.data, { status: response.status })
}
