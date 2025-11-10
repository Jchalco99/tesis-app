'use client'

import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, isInitialized, user } = useAuth()

  // Verificar si el usuario es admin
  const isAdmin = user?.roles?.includes('admin') ?? false

  useEffect(() => {
    // Esperar a que la autenticación se inicialice
    if (!isInitialized || isLoading) return

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN)
      return
    }

    // Si requiere admin pero no lo es, redirigir al dashboard
    if (requireAdmin && !isAdmin) {
      router.push(ROUTES.DASHBOARD)
      return
    }
  }, [isInitialized, isLoading, isAuthenticated, requireAdmin, isAdmin, router])

  // Mostrar loading mientras se verifica la autenticación o mientras carga
  if (!isInitialized || isLoading) {
    return (
      fallback || (
        <div className='flex items-center justify-center min-h-screen bg-gray-900'>
          <div className='flex items-center gap-2 text-white'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
            <span>Cargando...</span>
          </div>
        </div>
      )
    )
  }

  // Si no está autenticado, no renderizar nada (se redirigirá)
  if (!isAuthenticated) {
    return fallback || null
  }

  // Si requiere admin pero no lo es, no renderizar nada (se redirigirá)
  if (requireAdmin && !isAdmin) {
    return fallback || null
  }

  return <>{children}</>
}

// HOC para proteger componentes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requireAdmin = false
) {
  const WrappedComponent = (props: P) => {
    return (
      <ProtectedRoute requireAdmin={requireAdmin}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }

  WrappedComponent.displayName = `withAuth(${
    Component.displayName || Component.name
  })`

  return WrappedComponent
}
