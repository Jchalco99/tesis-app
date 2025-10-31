'use client'

import { useSidebar } from '@/contexts/sidebar-context'
import { useChatContext } from '@/providers/ChatProvider'
import { MessageSquare, Shield, User } from 'lucide-react'
import { useEffect } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { SidebarItem } from './sidebar-item'

const Sidebar = () => {
  const { isCollapsed } = useSidebar()
  const { conversations, loadConversations, isLoading } = useChatContext()

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  return (
    <div
      className={`bg-[#121516] text-white border-r border-gray-700 h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-[300px]'
      }`}
    >
      {/* Contenido superior */}
      <div
        className={`flex-1 overflow-y-auto custom-scrollbar ${
          isCollapsed ? 'px-2 collapsed' : 'px-4'
        }`}
      >
        <div className='pt-8 space-y-1'>
          <SidebarItem
            label='Nuevo chat'
            href='/'
            icon={<FaRegEdit className='w-4 h-4' />}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Sección de conversaciones - Con más espacio */}
        {!isCollapsed && conversations.length > 0 && (
          <div className='pt-6 flex-1 flex flex-col min-h-0'>
            <h3 className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2'>
              Conversaciones Recientes
            </h3>

            {/* Área de scroll personalizada para las conversaciones */}
            <div className='space-y-1 pr-2 custom-scrollbar'>
              {conversations.slice(0, 20).map((conversation) => (
                <SidebarItem
                  key={conversation.id}
                  label={conversation.title || 'Chat sin título'}
                  href={`/chat/${conversation.id}`}
                  icon={<MessageSquare className='w-4 h-4' />}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay conversaciones */}
        {!isCollapsed && conversations.length === 0 && !isLoading && (
          <div className='pt-6 px-2'>
            <p className='text-xs text-gray-500 text-center'>
              No hay conversaciones aún.
              <br />
              ¡Inicia tu primera conversación!
            </p>
          </div>
        )}

        {/* Loading state */}
        {!isCollapsed && isLoading && (
          <div className='pt-6 px-2'>
            <p className='text-xs text-gray-500 text-center'>
              Cargando conversaciones...
            </p>
          </div>
        )}
      </div>

      {/* Elementos del menú inferior - Siempre en la parte inferior */}
      <div
        className={`border-t border-gray-700 flex-shrink-0 ${
          isCollapsed ? 'px-2' : 'px-4'
        } py-4`}
      >
        <div className='space-y-1'>
          <SidebarItem
            label='Mi cuenta'
            href='/user'
            icon={<User className='w-4 h-4' />}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            label='Admin'
            href='/admin/panel'
            icon={<Shield className='w-4 h-4' />}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
