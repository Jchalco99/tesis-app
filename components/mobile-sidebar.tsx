import { Shield, User } from 'lucide-react'
import { FaRegEdit } from 'react-icons/fa'
import { RiRobot3Fill } from 'react-icons/ri'
import { SidebarItem } from './sidebar-item'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet'

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className='flex items-center gap-2 text-white hover:text-blue-400 transition-colors'>
          <RiRobot3Fill className='w-5 h-5 text-blue-400' />
          <h2 className='font-semibold'>TECSUP</h2>
        </button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='w-[300px] bg-[#121516] border-r border-gray-700'
      >
        <SheetTitle className='text-white mt-4 pl-3'>Menú</SheetTitle>
        <div className='space-y-1'>
          <SidebarItem
            label='Nuevo chat'
            href='/'
            icon={<FaRegEdit className='w-4 h-4' />}
          />
          <SidebarItem
            label='Mi cuenta'
            href='/user'
            icon={<User className='w-4 h-4' />}
          />
          <SidebarItem
            label='Admin'
            href='/admin/panel'
            icon={<Shield className='w-4 h-4' />}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
