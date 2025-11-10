import { AdminUsersService } from '@/services/admin-users.service'
import type { AdminUserFilters, AdminUserListItem } from '@/types/admin.types'
import { useCallback, useState } from 'react'

export const useAdminUsers = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<AdminUserListItem[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(20)

  /**
   * Cargar usuarios con filtros
   */
  const loadUsers = useCallback(async (filters: AdminUserFilters = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await AdminUsersService.getUsers(filters)
      setUsers(response.data)
      setTotal(response.total)
      setCurrentPage(response.page)
      setLimit(response.limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios')
      console.error('Error loading users:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Otorgar rol de admin
   */
  const grantAdmin = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true)
        setError(null)
        await AdminUsersService.grantAdmin(userId)
        // Recargar la lista de usuarios
        await loadUsers({ page: currentPage, limit })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al otorgar rol de admin'
        )
        console.error('Error granting admin:', err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadUsers, currentPage, limit]
  )

  /**
   * Revocar rol de admin
   */
  const revokeAdmin = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true)
        setError(null)
        await AdminUsersService.revokeAdmin(userId)
        // Recargar la lista de usuarios
        await loadUsers({ page: currentPage, limit })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al revocar rol de admin'
        )
        console.error('Error revoking admin:', err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadUsers, currentPage, limit]
  )

  return {
    isLoading,
    error,
    users,
    total,
    currentPage,
    limit,
    loadUsers,
    grantAdmin,
    revokeAdmin,
  }
}
