"use client";

import { Label } from "@/components/ui/label";
import AdminInput from "./admin-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AdminsPage() {
  const admins = [
    { id: 1, name: "Alejandro Ruiz", email: "alejandro@ejemplo.com" },
    { id: 2, name: "Isabel Torres", email: "isabel@ejemplo.com" },
    { id: 3, name: "Ricardo Vega", email: "ricardo@ejemplo.com" }
  ]

  return (
    <div className='p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
          Gestión de Administradores
        </h1>
        <p className='text-[#9db2b9] text-sm font-normal leading-normal'>
          Administra los administradores de la plataforma. Puedes añadir nuevos
          administradores, editar roles o eliminar cuentas.
        </p>
      </div>
      <div className='px-4 space-y-4'>
        <AdminInput
          title='Nombre'
          id='name'
          type='text'
          placeholder='Nombre'
        />

        <AdminInput
          title='Email'
          id='email'
          type='email'
          placeholder='Email'
        />

        <div className='w-full max-w-sm items-center space-y-2 py-2'>
          <Label htmlFor='role'>Rol</Label>
          <Select>
            <SelectTrigger className='h-10 w-full'>
              <SelectValue placeholder='Rol' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='user'>Usuario</SelectItem>
              <SelectItem value='admin'>Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant='primary' className='mt-2'>
          Añadir Administrador
        </Button>
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
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className='text-xs sm:text-sm'>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{admin.name}</span>
                    <span className='text-xs text-gray-400 sm:hidden'>
                      {admin.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='text-xs sm:text-sm hidden sm:table-cell'>
                  {admin.email}
                </TableCell>
                <TableCell className='text-xs sm:text-sm'>
                  <Badge variant='admin' className='text-xs'>
                    Administrador
                  </Badge>
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
                  <Button
                    variant='dangerOutline'
                    size='sm'
                    className='text-xs ml-2'
                  >
                    <span className='hidden sm:inline'>Eliminar</span>
                    <span className='sm:hidden'>X</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
