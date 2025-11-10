'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  ShieldOff,
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function UsersPage() {
  const {
    isLoading,
    users,
    total,
    currentPage,
    loadUsers,
    grantAdmin,
    revokeAdmin,
  } = useAdminUsers()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')
  const limit = 20

  useEffect(() => {
    loadUsers({
      q: searchQuery || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      role: roleFilter === 'all' ? undefined : roleFilter,
      page: currentPage,
      limit,
    })
  }, [loadUsers, currentPage, searchQuery, statusFilter, roleFilter])

  const totalPages = Math.ceil(total / limit)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadUsers({
      q: searchQuery || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      role: roleFilter === 'all' ? undefined : roleFilter,
      page: 1,
      limit,
    })
  }

  const handleGrantAdmin = async (userId: string) => {
    if (
      confirm(
        '¿Estás seguro de otorgar permisos de administrador a este usuario?'
      )
    ) {
      try {
        await grantAdmin(userId)
      } catch (error) {
        console.error('Error granting admin:', error)
      }
    }
  }

  const handleRevokeAdmin = async (userId: string) => {
    if (
      confirm(
        '¿Estás seguro de revocar los permisos de administrador de este usuario?'
      )
    ) {
      try {
        await revokeAdmin(userId)
      } catch (error) {
        console.error('Error revoking admin:', error)
      }
    }
  }

  return (
    <div className='h-full overflow-y-auto custom-scrollbar p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
          Gestión de Usuarios
        </h1>
        <p className='text-[#9db2b9] text-sm font-normal leading-normal'>
          Administra los usuarios registrados en la plataforma. Puedes ver
          detalles, editar roles o gestionar permisos.
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className='px-4 space-y-3'>
        <form onSubmit={handleSearch}>
          <InputGroup className='h-10 max-w-md'>
            <InputGroupInput
              placeholder='Buscar usuarios por nombre o correo'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon>
              <Search className='w-4 h-4' />
            </InputGroupAddon>
          </InputGroup>
        </form>

        <div className='flex gap-3 flex-wrap'>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as 'all' | 'active' | 'inactive')
            }
          >
            <SelectTrigger className='w-[150px] h-9'>
              <SelectValue placeholder='Estado' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todos</SelectItem>
              <SelectItem value='active'>Activos</SelectItem>
              <SelectItem value='inactive'>Inactivos</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={roleFilter}
            onValueChange={(value) =>
              setRoleFilter(value as 'all' | 'admin' | 'user')
            }
          >
            <SelectTrigger className='w-[150px] h-9'>
              <SelectValue placeholder='Rol' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todos los roles</SelectItem>
              <SelectItem value='admin'>Administradores</SelectItem>
              <SelectItem value='user'>Usuarios</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400' />
        </div>
      ) : (
        <>
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
                    Roles
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
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-center text-slate-400 py-8'
                    >
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const isAdmin = user.roles.includes('admin')
                    return (
                      <TableRow key={user.id}>
                        <TableCell className='text-xs sm:text-sm'>
                          <div className='flex flex-col'>
                            <span className='font-medium text-white'>
                              {user.display_name}
                            </span>
                            <span className='text-xs text-gray-400 sm:hidden'>
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='text-xs sm:text-sm hidden sm:table-cell text-slate-300'>
                          {user.email}
                        </TableCell>
                        <TableCell className='text-xs sm:text-sm'>
                          <div className='flex gap-1 flex-wrap'>
                            {user.roles.split(', ').map((role) => (
                              <Badge
                                key={role}
                                variant={role === 'admin' ? 'admin' : 'user'}
                                className='text-xs'
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className='text-xs sm:text-sm'>
                          {user.is_active ? (
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
                          <div className='flex gap-2'>
                            {isAdmin ? (
                              <Button
                                variant='dangerOutline'
                                size='sm'
                                className='text-xs'
                                onClick={() => handleRevokeAdmin(user.id)}
                                disabled={isLoading}
                              >
                                <ShieldOff className='w-3 h-3 sm:mr-1' />
                                <span className='hidden sm:inline'>
                                  Quitar Admin
                                </span>
                              </Button>
                            ) : (
                              <Button
                                variant='primaryOutline'
                                size='sm'
                                className='text-xs'
                                onClick={() => handleGrantAdmin(user.id)}
                                disabled={isLoading}
                              >
                                <Shield className='w-3 h-3 sm:mr-1' />
                                <span className='hidden sm:inline'>
                                  Hacer Admin
                                </span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className='flex items-center justify-between px-4 py-3 flex-wrap gap-3'>
              <div className='text-sm text-slate-400'>
                Mostrando {(currentPage - 1) * limit + 1} -{' '}
                {Math.min(currentPage * limit, total)} de {total} usuarios
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='ghostOutline'
                  size='sm'
                  onClick={() =>
                    loadUsers({
                      page: currentPage - 1,
                      limit,
                      q: searchQuery || undefined,
                      status: statusFilter === 'all' ? undefined : statusFilter,
                      role: roleFilter === 'all' ? undefined : roleFilter,
                    })
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className='w-4 h-4' />
                </Button>
                <div className='flex items-center gap-1 text-sm text-slate-300'>
                  <span>Página</span>
                  <span className='font-bold'>{currentPage}</span>
                  <span>de</span>
                  <span className='font-bold'>{totalPages}</span>
                </div>
                <Button
                  variant='ghostOutline'
                  size='sm'
                  onClick={() =>
                    loadUsers({
                      page: currentPage + 1,
                      limit,
                      q: searchQuery || undefined,
                      status: statusFilter === 'all' ? undefined : statusFilter,
                      role: roleFilter === 'all' ? undefined : roleFilter,
                    })
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className='w-4 h-4' />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
