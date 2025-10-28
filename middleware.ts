import { NextRequest, NextResponse } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = [
  '/',
  '/profile',
  '/admin'
]

// Rutas que requieren rol de admin
const adminRoutes = [
  '/admin'
]

// Rutas de autenticación (redirigir si ya está logueado)
const authRoutes = [
  '/login',
  '/register',
  '/verify'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  // Verificar estado de autenticación llamando al backend
  let isAuthenticated = false
  let isAdmin = false

  try {
    const response = await fetch(`${apiUrl}/me`, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
    })

    if (response.ok) {
      const text = await response.text()
      if (text) {
        try {
          const data = JSON.parse(text)
          isAuthenticated = data.isAuthenticated
          isAdmin = data.user?.roles?.includes('admin') ?? false
        } catch (parseError) {
          console.error('Error parsing JSON in middleware:', parseError)
          isAuthenticated = false
        }
      }
    }
  } catch (error) {
    console.error('Error verificando autenticación en middleware:', error)
    isAuthenticated = false
  }

  // Redirigir usuarios autenticados desde páginas de auth
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Verificar rutas de admin
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Verificar rutas protegidas
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Guardar la URL de destino para redirigir después del login
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
