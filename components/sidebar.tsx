'use client'

import { useSidebar } from '@/contexts/sidebar-context'
import { Shield, User } from 'lucide-react'
import { FaRegEdit } from 'react-icons/fa'
import { SidebarItem } from './sidebar-item'

const Sidebar = () => {
  const { isCollapsed } = useSidebar()

  return (
    <div
      className={`bg-[#121516] text-white border-r border-gray-700 min-h-full overflow-y-auto transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-[300px]'
      }`}
    >
      <div className={`px-4 pt-8 space-y-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <SidebarItem
          label='Nuevo chat'
          href='/'
          icon={<FaRegEdit className='w-4 h-4' />}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label='Mi cuenta'
          href='/user'
          icon={<User className='w-4 h-4' />}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label='Admin'
          href='/admin/panel'
          icon={<Shield className='w-4 h-4' />}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  )
}

export default Sidebar
