'use client'

import MessageComponent from '@/components/chat/message'
import ResultsSidebar from '@/components/chat/results-sidebar'
import { useChatContext } from '@/providers/ChatProvider'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import ChatInput from '../../chat-input'

export default function ChatIdPage() {
  const params = useParams()
  const conversationId = params.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    currentConversation,
    messages,
    loadConversation,
    isLoadingMessages,
    isSending,
    error,
  } = useChatContext()

  // Cargar conversación al montar
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId)
    }
  }, [conversationId, loadConversation])

  // Auto-scroll al final de los mensajes cuando se agregan nuevos
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length, isSending]) // Trigger cuando cambia la cantidad de mensajes o el estado de envío

  // Obtener sources del último mensaje del bot
  const lastBotMessage = [...messages]
    .reverse()
    .find((msg) => msg.sender === 'bot')
  const currentSources = lastBotMessage?.ai_sources || []

  if (isLoadingMessages) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='flex items-center gap-2 text-white'>
          <Loader2 className='w-5 h-5 animate-spin' />
          <span>Cargando conversación...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-red-400 text-center'>
          <p className='text-lg font-semibold'>
            Error al cargar la conversación
          </p>
          <p className='text-sm mt-2'>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full'>
      {/* Chat Area - Left Side */}
      <div className='flex-1 flex flex-col min-w-0'>
        <div className='flex-1 flex flex-col overflow-hidden'>
          {/* Header */}
          <div className='px-4 sm:px-6 py-4 border-b border-gray-700 flex-shrink-0'>
            <h2 className='text-white text-xl sm:text-2xl lg:text-[28px] font-bold'>
              {currentConversation?.title || 'TesisAI Chat'}
            </h2>
            <p className='text-slate-400 text-sm mt-1'>
              Búsqueda de tesis académicas con inteligencia artificial
            </p>
          </div>

          {/* Chat Messages */}
          <div className='flex-1 px-4 sm:px-6 py-4 overflow-y-auto custom-scrollbar'>
            <div className='space-y-6 max-w-4xl mx-auto'>
              {/* Mensaje de bienvenida si no hay mensajes */}
              {messages.length === 0 && !isSending && (
                <div className='flex items-end gap-3'>
                  <div
                    className='bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 sm:w-10 flex-shrink-0'
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAslSrExRAzL0hUUzsPH7MawQMsxNP0TlLrKL3xGZwN7cTBP6Lo_Qi3MczViwFHYPc9guuZ1XT9Km9EqoksMsRXIcnKsRuR0SD0q441IDylApvpf1co9uRnMT-Q9cQFS663ruJswoJlYG8dkm_KL5FVGOi7PY3iRNFbDN-6ixrEyQG1LLnfh9Mk2eCN_iWrjUrmXdzxj1B8sw1QZrIWb2wAiLVEK27tZbm-NoctU6EHGQpEIRNbXCZcGMT7QX-6zHDoQj8ZLDZbRWU")',
                    }}
                  />
                  <div className='flex flex-1 flex-col gap-1'>
                    <p className='text-slate-400 text-xs sm:text-sm'>TesisAI</p>
                    <div className='text-sm sm:text-base max-w-full sm:max-w-[400px] lg:max-w-[500px] rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 text-white'>
                      <p>
                        ¡Hola! Soy TesisAI. Puedo ayudarte a encontrar tesis y
                        pretesis académicas. ¿Qué te gustaría buscar?
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mensajes existentes */}
              {messages.map((message) => (
                <MessageComponent key={message.id} message={message} />
              ))}

              {/* Indicador de que el bot está escribiendo */}
              {isSending && (
                <div className='flex items-end gap-3'>
                  <div
                    className='bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 sm:w-10 flex-shrink-0'
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAslSrExRAzL0hUUzsPH7MawQMsxNP0TlLrKL3xGZwN7cTBP6Lo_Qi3MczViwFHYPc9guuZ1XT9Km9EqoksMsRXIcnKsRuR0SD0q441IDylApvpf1co9uRnMT-Q9cQFS663ruJswoJlYG8dkm_KL5FVGOi7PY3iRNFbDN-6ixrEyQG1LLnfh9Mk2eCN_iWrjUrmXdzxj1B8sw1QZrIWb2wAiLVEK27tZbm-NoctU6EHGQpEIRNbXCZcGMT7QX-6zHDoQj8ZLDZbRWU")',
                    }}
                  />
                  <div className='flex flex-1 flex-col gap-1'>
                    <p className='text-slate-400 text-xs sm:text-sm'>TesisAI</p>
                    <div className='text-sm sm:text-base max-w-[200px] rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 text-white'>
                      <div className='flex items-center gap-1'>
                        <div className='flex gap-1'>
                          <div className='w-2 h-2 bg-slate-400 rounded-full animate-pulse'></div>
                          <div
                            className='w-2 h-2 bg-slate-400 rounded-full animate-pulse'
                            style={{ animationDelay: '0.2s' }}
                          ></div>
                          <div
                            className='w-2 h-2 bg-slate-400 rounded-full animate-pulse'
                            style={{ animationDelay: '0.4s' }}
                          ></div>
                        </div>
                        <span className='text-xs text-slate-400 ml-2'>
                          Escribiendo...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input - Bottom of Chat Area */}
          <div className='px-4 sm:px-6 pb-4 pt-2 border-t border-gray-700 flex-shrink-0'>
            <ChatInput conversationId={conversationId} />
          </div>
        </div>
      </div>

      {/* Results Sidebar - Right Side */}
      <ResultsSidebar sources={currentSources} isLoading={isSending} />
    </div>
  )
}
