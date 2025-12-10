import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Rutas públicas que NO necesitan autenticación
const publicPaths = [
  '/login',
  '/register',
  '/verification',
  '/auth',
  '/_next',
  '/favicon.ico',
  '/api',
  '/.well-known',
  '/public'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir todas las rutas públicas
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Permitir archivos estáticos (con extensión)
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // Para rutas protegidas, simplemente continuar
  // La verificación se hará en el cliente
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
