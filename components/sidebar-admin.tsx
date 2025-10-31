'use client'

import { useSidebar } from '@/contexts/sidebar-context'
import { ArrowLeft, Home, Shield, Users } from 'lucide-react'
import { SidebarItem } from './sidebar-item'

const SidebarAdmin = () => {
  const { isCollapsed } = useSidebar()

  return (
    <div
      className={`bg-[#121516] text-white border-r border-gray-700 min-h-full overflow-y-auto custom-scrollbar transition-all duration-300 ${
        isCollapsed ? 'w-16 collapsed' : 'w-[300px]'
      }`}
    >
      <div className={`px-4 pt-8 space-y-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <SidebarItem
          label='Volver al Inicio'
          href='/'
          icon={<ArrowLeft className='w-4 h-4' />}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label='Panel Admin'
          href='/admin/panel'
          icon={<Home className='w-4 h-4' />}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label='Usuarios'
          href='/admin/users'
          icon={<Users className='w-4 h-4' />}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label='Administradores'
          href='/admin/admins'
          icon={<Shield className='w-4 h-4' />}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  )
}

export default SidebarAdmin
