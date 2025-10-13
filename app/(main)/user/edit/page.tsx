import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import ConfigurationInput from './configuration-input'
import NotificationSwitch from './notification-switch'

const UserEditPage = () => {
  return (
    <div className='p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
          Configuración de Usuario
        </h1>
      </div>
      <div className='px-4 space-y-4'>
        <ConfigurationInput
          title='Nombre'
          id='name'
          type='text'
          placeholder='Nombre'
          defaultValue=''
        />

        <ConfigurationInput
          title='Email'
          id='email'
          type='email'
          placeholder='Email'
          defaultValue=''
        />

        <div className='w-full max-w-sm items-center space-y-2 py-2'>
          <Label htmlFor='language'>Idioma</Label>
          <Select>
            <SelectTrigger className='h-10 w-full'>
              <SelectValue placeholder='Idioma' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='es'>Español</SelectItem>
              <SelectItem value='en'>Inglés</SelectItem>
              <SelectItem value='fr'>Francés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <h2 className='text-white text-lg sm:text-xl lg:text-2xl font-bold px-4 pt-2'>
        Notificaciones
      </h2>
      <div className='px-4 space-y-2'>
        <NotificationSwitch
          id='notifications'
          title='Activar Notificaciones'
          description='Recibe actualizaciones sobre nuevas tesis y pretesis.'
        />

        <NotificationSwitch
          id='comments'
          title='Comentarios'
          description='Notificaciones sobre comentarios en tus tesis.'
        />

        <NotificationSwitch
          id='new-theses'
          title='Nuevas Tesis'
          description='Notificaciones sobre nuevas tesis de tus intereses.'
        />
      </div>

      <div className='px-4 py-2'>
        <div className='flex flex-col sm:flex-row gap-3'>
          <Link href='/user'>
            <Button variant='danger' className='w-full sm:w-auto'>
              Cancelar
            </Button>
          </Link>
          <Link href='/user'>
            <Button variant='primary' className='w-full sm:w-auto'>
              Guardar Cambios
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserEditPage
