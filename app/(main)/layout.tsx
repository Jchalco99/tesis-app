import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { SidebarProvider } from '@/contexts/sidebar-context';
import { ChatProvider } from '@/providers/ChatProvider';

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <ChatProvider>
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
    </ChatProvider>
  );
};

export default MainLayout;
