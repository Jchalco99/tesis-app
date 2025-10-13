import HeaderAdmin from '@/components/header-admin'
import SidebarAdmin from '@/components/sidebar-admin'
import { SidebarProvider } from '@/contexts/sidebar-context'

type Props = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen bg-[#0e0f10]'>
        <div className='hidden lg:block'>
          <SidebarAdmin />
        </div>

        <div className='flex-1 flex flex-col min-w-0'>
          <HeaderAdmin />
          <main className='flex-1 overflow-auto p-0'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default AdminLayout
