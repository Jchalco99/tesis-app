import { apiClient } from '@/lib/api'

export interface DashboardStats {
  total_users: number
  active_users: number
  total_conversations: number
  total_messages: number
  total_feedback: number
  avg_rating: number
}

export interface ActivityData {
  period: string
  messages: number
  conversations: number
}

export const AdminService = {
  /**
   * Obtener estadísticas generales del dashboard
   */
  async getDashboardStats(): Promise<{
    ok: boolean
    data: DashboardStats
  }> {
    return await apiClient.get<{ ok: boolean; data: DashboardStats }>(
      '/api/admin/chat/stats'
    )
  },

  /**
   * Obtener actividad de la semana actual (últimos 7 días)
   */
  async getWeekActivity(): Promise<{
    ok: boolean
    data: ActivityData[]
  }> {
    return await apiClient.get<{ ok: boolean; data: ActivityData[] }>(
      '/api/admin/chat/activity/week'
    )
  },

  /**
   * Obtener actividad del mes actual (últimas 4 semanas)
   */
  async getMonthActivity(): Promise<{
    ok: boolean
    data: ActivityData[]
  }> {
    return await apiClient.get<{ ok: boolean; data: ActivityData[] }>(
      '/api/admin/chat/activity/month'
    )
  },

  /**
   * Obtener actividad del año actual (últimos 12 meses)
   */
  async getYearActivity(): Promise<{
    ok: boolean
    data: ActivityData[]
  }> {
    return await apiClient.get<{ ok: boolean; data: ActivityData[] }>(
      '/api/admin/chat/activity/year'
    )
  },
}
