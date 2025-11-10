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
  const { isAuthenticated, isLoading, user } = useAuth()

  // Verificar si el usuario es admin
  const isAdmin = user?.roles?.includes('admin') ?? false

  useEffect(() => {
    if (isLoading) return

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
  }, [isLoading, isAuthenticated, requireAdmin, isAdmin, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return fallback || <div>Cargando...</div>
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
