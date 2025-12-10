import {
  AdminService,
  type ActivityData,
  type DashboardStats,
} from '@/services/admin.service'
import { useCallback, useState } from 'react'

export function useAdmin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  )
  const [weekActivity, setWeekActivity] = useState<ActivityData[]>([])
  const [monthActivity, setMonthActivity] = useState<ActivityData[]>([])
  const [yearActivity, setYearActivity] = useState<ActivityData[]>([])

  const loadDashboardStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await AdminService.getDashboardStats()
      if (response.ok) {
        setDashboardStats(response.data)
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err)
      setError(
        err instanceof Error ? err.message : 'Error al cargar estadísticas'
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadWeekActivity = useCallback(async () => {
    try {
      const response = await AdminService.getWeekActivity()
      if (response.ok) {
        setWeekActivity(response.data)
      }
    } catch (err) {
      console.error('Error loading week activity:', err)
    }
  }, [])

  const loadMonthActivity = useCallback(async () => {
    try {
      const response = await AdminService.getMonthActivity()
      if (response.ok) {
        setMonthActivity(response.data)
      }
    } catch (err) {
      console.error('Error loading month activity:', err)
    }
  }, [])

  const loadYearActivity = useCallback(async () => {
    try {
      const response = await AdminService.getYearActivity()
      if (response.ok) {
        setYearActivity(response.data)
      }
    } catch (err) {
      console.error('Error loading year activity:', err)
    }
  }, [])

  return {
    isLoading,
    error,
    dashboardStats,
    weekActivity,
    monthActivity,
    yearActivity,
    loadDashboardStats,
    loadWeekActivity,
    loadMonthActivity,
    loadYearActivity,
  }
}
