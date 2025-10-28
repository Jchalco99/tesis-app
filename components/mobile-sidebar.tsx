'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, MessageSquare } from 'lucide-react';
import { FaRegEdit } from 'react-icons/fa';
import { RiRobot3Fill } from 'react-icons/ri';
import { SidebarItem } from './sidebar-item';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { useChatContext } from '@/providers/ChatProvider';

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { conversations, loadConversations, isLoading } = useChatContext();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleItemClick = () => {
    // Cerrar el sheet en mobile al hacer clic en un item
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className='flex items-center gap-2 text-white hover:text-blue-400 transition-colors'>
          <RiRobot3Fill className='w-5 h-5 text-blue-400' />
          <h2 className='font-semibold'>TesisAI</h2>
        </button>
      </SheetTrigger>

      <SheetContent
        side='left'
        className='w-[300px] bg-[#121516] border-r border-gray-700 flex flex-col p-0'
      >
        <div className='flex-1 flex flex-col overflow-hidden'>
          {/* Header */}
          <div className='px-4 pt-6 pb-4'>
            <SheetTitle className='text-white text-lg font-semibold flex items-center gap-2'>
              <RiRobot3Fill className='w-6 h-6 text-blue-400' />
              TesisAI
            </SheetTitle>
          </div>

          {/* Contenido principal */}
          <div className='flex-1 px-4 overflow-hidden flex flex-col'>
            {/* Nuevo Chat */}
            <div className='mb-4'>
              <SidebarItem
                label='Nuevo chat'
                href='/'
                icon={<FaRegEdit className='w-4 h-4' />}
                isCollapsed={false}
                onClick={handleItemClick}
              />
            </div>

            {/* Sección de conversaciones */}
            {conversations.length > 0 && (
              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Conversaciones Recientes
                </h3>

                {/* Lista de conversaciones con scroll */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-2 mobile-custom-scrollbar">
                  {conversations.slice(0, 15).map((conversation) => (
                    <SidebarItem
                      key={conversation.id}
                      label={conversation.title || 'Chat sin título'}
                      href={`/chat/${conversation.id}`}
                      icon={<MessageSquare className='w-4 h-4' />}
                      isCollapsed={false}
                      onClick={handleItemClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Mensaje cuando no hay conversaciones */}
            {conversations.length === 0 && !isLoading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-4">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-1">
                    No hay conversaciones aún
                  </p>
                  <p className="text-xs text-gray-600">
                    ¡Inicia tu primera conversación!
                  </p>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3"></div>
                  <p className="text-xs text-gray-500">
                    Cargando conversaciones...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Elementos del menú inferior - Siempre visible */}
        <div className='border-t border-gray-700 p-4 mt-auto bg-[#121516]'>
          <div className="space-y-1">
            <SidebarItem
              label='Mi cuenta'
              href='/user'
              icon={<User className='w-4 h-4' />}
              isCollapsed={false}
              onClick={handleItemClick}
            />
            <SidebarItem
              label='Admin'
              href='/admin/panel'
              icon={<Shield className='w-4 h-4' />}
              isCollapsed={false}
              onClick={handleItemClick}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
