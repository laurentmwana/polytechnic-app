import { NextRequest, NextResponse } from 'next/server'
import { GUEST_ROUTES } from './constants/granted'
import { webRoute } from './lib/route'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Récupérer le token de session (côté serveur)
  const token = await getToken({ req, secret })

  if (token?.email) {
    if (GUEST_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL(webRoute('welcome'), req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
