import { NextRequest, NextResponse } from 'next/server'

// Rutas que quieres desactivar
const disabledRoutes = [
  '/trade/recurring',
  '/trade/limit-range',
  '/trade/dca',
  '/lock',
  '/lock/(.*)',
  '/vote',
  '/rewards',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (disabledRoutes.some((route) => new RegExp(`^${route}$`).test(pathname))) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/trade/recurring', '/trade/limit-range', '/trade/dca', '/lock', '/lock/(.*)', '/vote', '/rewards'],
}
