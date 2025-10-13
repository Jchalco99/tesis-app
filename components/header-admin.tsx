'use client'

import { useSidebar } from '@/contexts/sidebar-context'
import { Shield } from 'lucide-react'
import { MobileSidebarAdmin } from './mobile-sidebar-admin'

const HeaderAdmin = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <header className='flex items-center h-12 px-3 sm:px-4 bg-[#121516] border-b border-gray-700'>
      {/* Mobile: Mostrar MobileSidebarAdmin */}
      <div className='lg:hidden'>
        <MobileSidebarAdmin />
      </div>

      {/* Desktop: Mostrar título clickeable */}
      <div className='hidden lg:flex'>
        <button
          onClick={toggleSidebar}
          className='flex items-center gap-2 text-white hover:text-blue-400 transition-colors p-1.5 rounded-md'
        >
          <Shield className='w-5 h-5 text-blue-400' />
          <h2 className='font-semibold text-sm lg:text-base'>TECSUP Admin</h2>
        </button>
      </div>
    </header>
  )
}

export default HeaderAdmin
