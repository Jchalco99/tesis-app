import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/', '/chat', '/user'];

// Rutas que requieren rol de administrador
const adminRoutes = ['/admin'];

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
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Permitir rutas de auth sin verificación (para evitar bucles)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verificar si es una ruta de admin
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    try {
      const authData = await checkAuthentication(request);

      if (!authData.isAuthenticated) {
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Verificar si el usuario tiene el rol de admin
      const isAdmin = authData.user?.roles?.includes('admin') ?? false;
      if (!isAdmin) {
        // Redirigir a la página principal si no es admin
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  // Solo verificar autenticación para rutas protegidas
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    try {
      const authData = await checkAuthentication(request);

      if (!authData.isAuthenticated) {
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

async function checkAuthentication(request: NextRequest): Promise<{
  isAuthenticated: boolean
  user?: {
    id: string
    email: string
    display_name: string
    roles?: string[]
  }
}> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Obtener la cookie de sesión correctamente usando request.cookies
    const sessionCookie = request.cookies.get('connect.sid');

    if (!sessionCookie) {
      console.log('[Middleware] No session cookie found');
      return { isAuthenticated: false };
    }

    const response = await fetch(`${apiUrl}/me`, {
      method: 'GET',
      headers: {
        'Cookie': `connect.sid=${sessionCookie.value}`,
        'User-Agent': request.headers.get('user-agent') || '',
      },
      credentials: 'include',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.log('[Middleware] Auth check failed:', response.status);
      return { isAuthenticated: false };
    }

    const data = await response.json();
    console.log('[Middleware] User authenticated:', data.user?.email);

    return {
      isAuthenticated: true,
      user: data.user,
    };
  } catch (error) {
    console.error('[Middleware] Error checking authentication:', error);
    return { isAuthenticated: false };
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
