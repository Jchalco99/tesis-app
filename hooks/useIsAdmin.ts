import { useAuthContext } from '@/providers/AuthProvider'

export function useIsAdmin(): boolean {
  const { user, isAuthenticated } = useAuthContext()

  if (!isAuthenticated || !user) {
    return false
  }

  // Verificar si el usuario tiene el rol 'admin'
  return user.roles?.includes('admin') ?? false
}
