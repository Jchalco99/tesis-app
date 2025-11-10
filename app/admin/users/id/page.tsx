import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import InfoSectionAdmin from './info-section-admin'
import UserProfileAdmin from './user-profile-admin'

export default function AdminUserPage() {
  const userInfo = [
    { label: 'Nombre', value: 'Ricardo Mendoza' },
    { label: 'Correo Electrónico', value: 'ricardo.mendoza@email.com' },
    { label: 'Rol', value: 'Administrador' },
  ]

  const userActivity = [
    { label: 'Fecha de Registro', value: '15 de Marzo de 2023' },
    { label: 'Consultas Realizadas', value: '125' },
  ]

  const userActivityTable = [
    {
      id: 1,
      date: '2024-07-26',
      action: 'Consulta',
      details: 'Tesis sobre energías renovables',
    },
    {
      id: 2,
      date: '2024-07-25',
      action: 'Consulta',
      details: 'Pretesis sobre inteligencia artificial',
    },
    { id: 3, date: '2024-07-24', action: 'Registro', details: 'Cuenta creada' },
  ]

  return (
    <div className='h-full overflow-y-auto custom-scrollbar p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
          Perfil de Usuario
        </h1>
      </div>
      <div className='p-4'>
        <UserProfileAdmin
          name='Ricardo Mendoza'
          email='ricardo.mendoza@email.com'
          src='https://github.com/shadcn.png'
          alt='@shadcn'
          fallback='CN'
          role='Administrador'
        />
      </div>

      <InfoSectionAdmin title='Información del Usuario' items={userInfo} />

      <InfoSectionAdmin title='Actividad del Usuario' items={userActivity} />

      <h2 className='text-white text-lg sm:text-xl lg:text-2xl font-bold px-4 pt-2'>
        Historial de Actividad
      </h2>
      <div className='px-4 overflow-x-auto'>
        <Table className='min-w-full'>
          <TableHeader>
            <TableRow className='bg-slate-700 hover:bg-slate-700/80'>
              <TableHead className='font-bold text-xs sm:text-sm'>
                Fecha
              </TableHead>
              <TableHead className='font-bold text-xs sm:text-sm'>
                Acción
              </TableHead>
              <TableHead className='font-bold text-xs sm:text-sm'>
                Detalles
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userActivityTable.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className='text-xs sm:text-sm'>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{activity.date}</span>
                  </div>
                </TableCell>
                <TableCell className='text-xs sm:text-sm'>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{activity.action}</span>
                  </div>
                </TableCell>
                <TableCell className='text-xs sm:text-sm'>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{activity.details}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
