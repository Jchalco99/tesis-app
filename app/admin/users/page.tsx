import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search } from 'lucide-react'
import Link from 'next/link'

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: 'Elena Ramirez',
      email: 'elena.ramirez@email.com',
      role: 'Usuario',
      status: 1,
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@email.com',
      role: 'Moderador',
      status: 0,
    },
    {
      id: 3,
      name: 'Sofia Vargas',
      email: 'sofia.vargas@email.com',
      role: 'Usuario',
      status: 1,
    },
    {
      id: 4,
      name: 'Diego Herrera',
      email: 'diego.herrera@email.com',
      role: 'Moderador',
      status: 0,
    },
    {
      id: 5,
      name: 'Lucia Fernandez',
      email: 'lucia.fernandez@email.com',
      role: 'Usuario',
      status: 1,
    },
  ]
  return (
    <div className='p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
          Gestión de Usuarios
        </h1>
        <p className='text-[#9db2b9] text-sm font-normal leading-normal'>
          Administra los usuarios registrados en la plataforma. Puedes ver
          detalles, editar información o eliminar cuentas.
        </p>
      </div>
      <div className='px-4 py-3'>
        <InputGroup className='h-10 max-w-md'>
          <InputGroupInput placeholder='Buscar usuarios por nombre o correo' />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <h2 className='text-white text-lg sm:text-xl lg:text-2xl font-bold px-4 pt-2'>
        Lista de Usuarios
      </h2>
      <div className='px-4 overflow-x-auto'>
        <Table className='min-w-full'>
          <TableHeader>
            <TableRow className='bg-slate-700 hover:bg-slate-700/80'>
              <TableHead className='font-bold text-xs sm:text-sm'>
                Nombre
              </TableHead>
              <TableHead className='font-bold text-xs sm:text-sm hidden sm:table-cell'>
                Correo
              </TableHead>
              <TableHead className='font-bold text-xs sm:text-sm'>
                Rol
              </TableHead>
              <TableHead className='font-bold text-xs sm:text-sm'>
                Estado
              </TableHead>
              <TableHead className='font-bold text-xs sm:text-sm'>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='text-xs sm:text-sm'>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{user.name}</span>
                    <span className='text-xs text-gray-400 sm:hidden'>
                      {user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='text-xs sm:text-sm hidden sm:table-cell'>
                  {user.email}
                </TableCell>
                <TableCell className='text-xs sm:text-sm'>
                  {user.role === 'Usuario' ? (
                    <Badge variant='user' className='text-xs'>
                      Usuario
                    </Badge>
                  ) : (
                    <Badge variant='admin' className='text-xs'>
                      Moderador
                    </Badge>
                  )}
                </TableCell>
                <TableCell className='text-xs sm:text-sm'>
                  {user.status === 1 ? (
                    <Badge variant='active' className='text-xs'>
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant='inactive' className='text-xs'>
                      Inactivo
                    </Badge>
                  )}
                </TableCell>
                <TableCell className='text-xs sm:text-sm'>
                  <Link href='/admin/users/id'>
                    <Button
                      variant='primaryOutline'
                      size='sm'
                      className='text-xs'
                    >
                      <span className='hidden sm:inline'>Ver detalles</span>
                      <span className='sm:hidden'>Ver</span>
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
