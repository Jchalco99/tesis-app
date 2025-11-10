import { apiClient } from '@/lib/api'
import type { AdminUserFilters, AdminUserListResponse } from '@/types/admin.types'

export const AdminUsersService = {
  /**
   * Obtener listado de usuarios con filtros
   */
  async getUsers(filters: AdminUserFilters = {}): Promise<AdminUserListResponse> {
    const queryParams = new URLSearchParams()

    if (filters.q) queryParams.append('q', filters.q)
    if (filters.page) queryParams.append('page', filters.page.toString())
    if (filters.limit) queryParams.append('limit', filters.limit.toString())
    if (filters.role) queryParams.append('role', filters.role)
    if (filters.status) queryParams.append('status', filters.status)

    return await apiClient.get<AdminUserListResponse>(
      `/api/admin/users?${queryParams.toString()}`
    )
  },

  /**
   * Otorgar rol de administrador a un usuario
   */
  async grantAdmin(userId: string): Promise<{ ok: boolean }> {
    return await apiClient.post<{ ok: boolean }>(
      `/api/admin/users/${userId}/grant-admin`
    )
  },

  /**
   * Revocar rol de administrador a un usuario
   */
  async revokeAdmin(userId: string): Promise<{ ok: boolean }> {
    return await apiClient.post<{ ok: boolean }>(
      `/api/admin/users/${userId}/revoke-admin`
    )
  },
}
