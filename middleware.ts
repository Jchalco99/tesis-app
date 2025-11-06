import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/', '/chat', '/user', '/admin'];

// Rutas solo para usuarios no autenticados (no requieren auth)
const authRoutes = ['/login', '/register', '/verification'];

// Rutas públicas (no requieren verificación)
const publicRoutes = ['/auth/callback'];

// Rutas de API que no deben ser interceptadas
const apiRoutes = ['/api', '/_next', '/favicon.ico'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas de API, archivos estáticos, etc.
  if (apiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Permitir rutas públicas sin verificación
  if (publicRoutes.includes(pathname) || pathname === '/') {
    return NextResponse.next();
  }

  // Permitir rutas de auth sin verificación (para evitar bucles)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Solo verificar autenticación para rutas protegidas
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    try {
      const isAuthenticated = await checkAuthentication(request);

      if (!isAuthenticated) {
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      // En caso de error, redirigir a login
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

async function checkAuthentication(request: NextRequest): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(`${apiUrl}/me`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'User-Agent': request.headers.get('user-agent') || '',
      },
      // Agregar timeout para evitar cuelgues
      signal: AbortSignal.timeout(5000), // 5 segundos
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isAuthenticated === true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false; // En caso de error, asumir no autenticado
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
  ],
};
