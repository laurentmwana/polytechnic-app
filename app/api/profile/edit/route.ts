import { UserMe } from '#/model'
import { authOptions } from '@/lib/auth-option'
import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
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

  const response = await fetchJson(apiRoute('profile.edit'), {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (response.status === 200) {
    const meResponse = await fetchJson<UserMe>(apiRoute('me'), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    if (meResponse.status !== 200) {
      throw new Error(
        "Nous n'avons pas pu récupérer vos informations, meric de vous réconnecter"
      )
    }

    return NextResponse.json({ message: 'Succès', user: meResponse.data })
  }

  return NextResponse.json(response.data, { status: response.status })
}
