import { AdminRoute } from '@/components/auth/AdminRoute'
import HeaderAdmin from '@/components/header-admin'
import SidebarAdmin from '@/components/sidebar-admin'
import { SidebarProvider } from '@/contexts/sidebar-context'

type Props = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
  return (
    <AdminRoute>
      <SidebarProvider>
        <div className='flex h-screen overflow-hidden'>
          <div className='hidden lg:block'>
            <SidebarAdmin />
          </div>

          <div className='flex-1 flex flex-col min-w-0'>
            <HeaderAdmin />
            <main className='flex-1 overflow-hidden'>{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AdminRoute>
  )
}

export default AdminLayout
