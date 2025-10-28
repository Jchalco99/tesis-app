'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthGuard } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  fallback
}: ProtectedRouteProps) {
  const router = useRouter()
  const {
    isAuthenticated,
    isLoading,
    isAdmin,
    requiresAuth,
    requiresAdmin
  } = useAuthGuard()

  useEffect(() => {
    if (isLoading) return

    if (requiresAuth) {
      router.push(ROUTES.LOGIN)
      return
    }

    if (requireAdmin && requiresAdmin) {
      router.push(ROUTES.DASHBOARD)
      return
    }
  }, [isLoading, requiresAuth, requiresAdmin, requireAdmin, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return fallback || <div>Cargando...</div>
  }

  // Si no está autenticado, no renderizar nada (se redirigirá)
  if (requiresAuth) {
    return fallback || null
  }

  // Si requiere admin pero no lo es, no renderizar nada (se redirigirá)
  if (requireAdmin && requiresAdmin) {
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

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`

  return WrappedComponent
}
