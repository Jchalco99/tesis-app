import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Notebook, UserRoundSearch, UsersRound } from 'lucide-react'
import { InfoCard } from './info-card'
import Month from './month'
import Week from './week'
import Year from './year'

export default function PanelPage() {
  return (
    <div className='p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
          Panel de Administración
        </h1>
      </div>

      <section className='space-y-3 md:space-y-4'>
        <h2 className='text-white text-lg md:text-xl font-bold'>
          Estadísticas Clave
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'>
          <InfoCard
            title='Consultas Totales'
            info='1,234'
            icon={<UserRoundSearch />}
          />
          <InfoCard title='Tesis Buscadas' info='567' icon={<Notebook />} />
          <InfoCard title='Usuarios Activos' info='890' icon={<UsersRound />} />
        </div>
      </section>

      <section className='space-y-3 md:space-y-4'>
        <h2 className='text-white text-lg md:text-xl font-bold'>
          Consultas por Período
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
              <Week />
            </TabsContent>
            <TabsContent value='month' className='mt-3 md:mt-4'>
              <Month />
            </TabsContent>
            <TabsContent value='year' className='mt-3 md:mt-4'>
              <Year />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
