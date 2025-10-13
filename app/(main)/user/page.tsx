import { Button } from '@/components/ui/button'
import Link from 'next/link'
import UserProfile from './user-profile'
import InfoSection from './info-section'

export default function UserPage() {
  const userInfo = [
    { label: 'Nombre', value: 'Ricardo Mendoza' },
    { label: 'Correo Electrónico', value: 'ricardo.mendoza@email.com' }
  ]

  const userActivity = [
    { label: 'Fecha de Registro', value: '15 de Marzo de 2023' },
    { label: 'Consultas Realizadas', value: '125' }
  ]

  return (
    <div className='p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
          Perfil de Usuario
        </h1>
      </div>
      <div className='p-4'>
        <UserProfile
          name='Ricardo Mendoza'
          email='ricardo.mendoza@email.com'
          src='https://github.com/shadcn.png'
          alt='@shadcn'
          fallback='CN'
        />
      </div>

      <InfoSection
        title="Información del Usuario"
        items={userInfo}
      />

      <InfoSection
        title="Actividad del Usuario"
        items={userActivity}
      />

      <div className='px-4 py-4'>
        <div className='flex flex-col sm:flex-row gap-3'>
          <Link href='/user/edit'>
            <Button variant='ghost' className='w-full sm:w-auto'>
              Editar Información
            </Button>
          </Link>
          <Link href='/login'>
            <Button variant='danger' className='w-full sm:w-auto'>
              Suspender Cuenta
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
