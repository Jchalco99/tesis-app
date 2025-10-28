'use client'

// Directamente re-exportar el hook del AuthProvider
import { useAuth } from '@/providers/AuthProvider'
export { useAuth } from '@/providers/AuthProvider'

// Hook adicional para verificaciones comunes
export function useAuthGuard() {
  const { user, isAuthenticated, isLoading } = useAuth()

  const isAdmin = user?.roles?.includes('admin') ?? false
  const isActive = user?.is_active ?? false

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    isActive,
    requiresAuth: !isAuthenticated && !isLoading,
    requiresAdmin: isAuthenticated && !isAdmin,
  }
}
