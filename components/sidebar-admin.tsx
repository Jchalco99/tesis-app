'use client'

import { useSidebar } from '@/contexts/sidebar-context'
import {
  ArrowLeft,
  BarChart3,
  Home,
  MessageSquare,
  Shield,
  Users,
} from 'lucide-react'
import { SidebarItem } from './sidebar-item'

const SidebarAdmin = () => {
  const { isCollapsed } = useSidebar()

  return (
    <div
      className={`bg-[#121516] text-white border-r border-gray-700 h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-[300px]'
      }`}
    >
      {/* Contenido superior */}
      <div
        className={`flex-1 overflow-y-auto custom-scrollbar ${
          isCollapsed ? 'px-2 collapsed' : 'px-4'
        }`}
      >
        <div className='pt-8 space-y-1'>
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
            label='Analytics'
            href='/admin/analytics'
            icon={<BarChart3 className='w-4 h-4' />}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            label='Conversaciones'
            href='/admin/conversations'
            icon={<MessageSquare className='w-4 h-4' />}
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
    </div>
  )
}

export default SidebarAdmin
