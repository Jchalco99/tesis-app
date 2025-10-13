'use client'

import { useSidebar } from '@/contexts/sidebar-context'
import { RiRobot3Fill } from 'react-icons/ri'
import { MobileSidebar } from './mobile-sidebar'

const Header = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <header className='flex items-center h-12 px-4 bg-[#121516] border-b border-gray-700'>
      <div className='lg:hidden'>
        <MobileSidebar />
      </div>

      <div className='hidden lg:flex'>
        <button
          onClick={toggleSidebar}
          className='flex items-center gap-2 text-white hover:text-blue-400 transition-colors p-2 rounded-md'
        >
          <RiRobot3Fill className='w-5 h-5 text-blue-400' />
          <h2 className='font-semibold'>TECSUP</h2>
        </button>
      </div>
    </header>
  )
}

export default Header
