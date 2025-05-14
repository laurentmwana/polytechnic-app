import { authOptions } from '@/lib/auth-option'
import { fetchJson } from '@/lib/fetch'
import { apiRoute } from '@/lib/route'
import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

export const POST = async () => {
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

  const response = await fetchJson(apiRoute('logout'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  })

  if (response.status === 200) {
    const response = NextResponse.json({ message: 'Déconnexion réussie' })
    response.cookies.set('next-auth.session-token', '', {
      maxAge: 0,
      path: '/',
    })
    return response
  }

  return NextResponse.json(response.data, { status: response.status })
}
