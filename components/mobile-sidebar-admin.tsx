import {
  ArrowLeft,
  BarChart3,
  Home,
  MessageSquare,
  Shield,
  Users,
} from 'lucide-react'
import { SidebarItem } from './sidebar-item'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet'

export const MobileSidebarAdmin = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className='flex items-center gap-2 text-white hover:text-blue-400 transition-colors'>
          <Shield className='w-5 h-5 text-blue-400' />
          <h2 className='font-semibold'>TECSUP</h2>
        </button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='w-[280px] bg-[#121516] border-r border-gray-700 p-0'
      >
        <SheetTitle className='text-white mt-6 px-4 text-lg'>
          Menú Admin
        </SheetTitle>
        <div className='space-y-1 px-2'>
          <SidebarItem
            label='Volver al Inicio'
            href='/'
            icon={<ArrowLeft className='w-4 h-4' />}
          />
          <SidebarItem
            label='Panel Admin'
            href='/admin/panel'
            icon={<Home className='w-4 h-4' />}
          />
          <SidebarItem
            label='Analytics'
            href='/admin/analytics'
            icon={<BarChart3 className='w-4 h-4' />}
          />
          <SidebarItem
            label='Conversaciones'
            href='/admin/conversations'
            icon={<MessageSquare className='w-4 h-4' />}
          />
          <SidebarItem
            label='Usuarios'
            href='/admin/users'
            icon={<Users className='w-4 h-4' />}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
