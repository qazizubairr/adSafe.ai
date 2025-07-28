import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes that don't need auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/stripe/webhook') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // For dashboard pages, we'll let the client-side handle auth checks
  // The AuthContext will handle redirects if user is not authenticated
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // For auth pages, we'll let the client-side handle redirects
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 