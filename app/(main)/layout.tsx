import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import { SidebarProvider } from '@/contexts/sidebar-context'
import { ChatProvider } from '@/providers/ChatProvider'

type Props = {
  children: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <ProtectedRoute>
      <ChatProvider>
        <SidebarProvider>
          <div className='flex h-screen overflow-hidden'>
            <div className='hidden lg:block'>
              <Sidebar />
            </div>

            <div className='flex-1 flex flex-col min-w-0'>
              <Header />
              <main className='flex-1 overflow-hidden'>{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </ChatProvider>
    </ProtectedRoute>
  )
}

export default MainLayout
