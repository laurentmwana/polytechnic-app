import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_ROUTES, AUTH_ROUTES, GUEST_ROUTES } from '@/constants/granted'
import { webRoute } from '@/lib/route'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({ req, secret })

  if (token && GUEST_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(webRoute('welcome'), req.nextUrl))
  }

  if (token && ADMIN_ROUTES.includes(pathname)) {
    throw new Error("Vous n'êtes pas autorisé à acceder à cette page")
  }

  if (!token && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(webRoute('login'), req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
