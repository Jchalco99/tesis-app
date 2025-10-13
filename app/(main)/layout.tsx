import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import { SidebarProvider } from '@/contexts/sidebar-context'

type Props = {
  children: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen'>
        <div className='hidden lg:block'>
          <Sidebar />
        </div>

        <div className='flex-1 flex flex-col'>
          <Header />
          <main className='flex-1 overflow-auto'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default MainLayout
