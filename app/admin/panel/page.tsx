'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdmin } from '@/hooks/useAdmin'
import {
  MessageSquare,
  Notebook,
  Star,
  UserRoundSearch,
  UsersRound,
} from 'lucide-react'
import { useEffect } from 'react'
import { InfoCard } from './info-card'
import Month from './month'
import Week from './week'
import Year from './year'

export default function PanelPage() {
  const {
    isLoading,
    dashboardStats,
    weekActivity,
    monthActivity,
    yearActivity,
    loadDashboardStats,
    loadWeekActivity,
    loadMonthActivity,
    loadYearActivity,
  } = useAdmin()

  useEffect(() => {
    loadDashboardStats()
    loadWeekActivity()
    loadMonthActivity()
    loadYearActivity()
  }, [
    loadDashboardStats,
    loadWeekActivity,
    loadMonthActivity,
    loadYearActivity,
  ])

  return (
    <div className='h-full overflow-y-auto custom-scrollbar p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
          Panel de Administración
        </h1>
        <p className='text-[#9db2b9] text-sm font-normal leading-normal'>
          Vista general de las estadísticas de la plataforma
        </p>
      </div>

      <section className='space-y-3 md:space-y-4'>
        <h2 className='text-white text-lg md:text-xl font-bold'>
          Estadísticas Clave
        </h2>
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400' />
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'>
            <InfoCard
              title='Usuarios Totales'
              info={dashboardStats?.total_users.toString() || '0'}
              icon={<UsersRound />}
            />
            <InfoCard
              title='Usuarios Activos'
              info={dashboardStats?.active_users.toString() || '0'}
              icon={<UserRoundSearch />}
            />
            <InfoCard
              title='Conversaciones Totales'
              info={dashboardStats?.total_conversations.toString() || '0'}
              icon={<Notebook />}
            />
            <InfoCard
              title='Mensajes Totales'
              info={dashboardStats?.total_messages.toString() || '0'}
              icon={<MessageSquare />}
            />
            <InfoCard
              title='Calificaciones Totales'
              info={dashboardStats?.total_feedback.toString() || '0'}
              icon={<Star />}
            />
            <InfoCard
              title='Calificación Promedio'
              info={
                dashboardStats?.avg_rating
                  ? dashboardStats.avg_rating.toFixed(2)
                  : '0.00'
              }
              icon={<Star className='fill-yellow-400 text-yellow-400' />}
            />
          </div>
        )}
      </section>

      <section className='space-y-3 md:space-y-4'>
        <h2 className='text-white text-lg md:text-xl font-bold'>
          Actividad por Período
        </h2>
        <div className='bg-slate-800 rounded-lg p-3 md:p-4'>
          <Tabs defaultValue='month' className='w-full'>
            <TabsList className='grid w-full grid-cols-3 h-9 md:h-10'>
              <TabsTrigger value='week' className='text-xs md:text-sm'>
                Semana
              </TabsTrigger>
              <TabsTrigger value='month' className='text-xs md:text-sm'>
                Mes
              </TabsTrigger>
              <TabsTrigger value='year' className='text-xs md:text-sm'>
                Año
              </TabsTrigger>
            </TabsList>
            <TabsContent value='week' className='mt-3 md:mt-4'>
              <Week data={weekActivity} />
            </TabsContent>
            <TabsContent value='month' className='mt-3 md:mt-4'>
              <Month data={monthActivity} />
            </TabsContent>
            <TabsContent value='year' className='mt-3 md:mt-4'>
              <Year data={yearActivity} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
