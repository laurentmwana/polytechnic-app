import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './lib/encryption'
import { webRoute } from './lib/route'
import { SESSION_ID } from './constants/authorization'

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  
  const cookieStore = req.cookies
  const cookieData = cookieStore.get(SESSION_ID)?.value

  if (!cookieData) {
    return NextResponse.next()
  }

  let session
  try {
    // Tenter de déchiffrer et vérifier le JWT
    session = await decrypt(cookieData)
  } catch (error) {
    console.error('Session verification failed:', error)
    cookieStore.delete(SESSION_ID)
    return NextResponse.redirect(new URL(webRoute('login'), req.nextUrl))
  }

  // if (ROUTE_GUEST.includes(path) && session?.token) {
  //   return NextResponse.redirect(
  //     new URL(webRoute('welcome', { is_login: true }), req.nextUrl)
  //   )
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
