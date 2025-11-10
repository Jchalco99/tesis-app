'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAnalytics } from '@/hooks/useAnalytics'
import {
  ArrowLeft,
  MessageSquare,
  Star,
  ThumbsDown,
  ThumbsUp,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function ConversationDetailPage() {
  const params = useParams()
  const conversationId = params.id as string

  const { isLoading, conversationDetail, loadConversationDetail } =
    useAnalytics()

  useEffect(() => {
    if (conversationId) {
      loadConversationDetail(conversationId)
    }
  }, [conversationId, loadConversationDetail])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getRatingIcon = (rating: number) => {
    if (rating >= 4) return <ThumbsUp className='w-4 h-4 text-green-400' />
    if (rating <= 2) return <ThumbsDown className='w-4 h-4 text-red-400' />
    return <Star className='w-4 h-4 text-yellow-400' />
  }

  if (isLoading) {
    return (
      <div className='h-full flex justify-center items-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400' />
      </div>
    )
  }

  if (!conversationDetail) {
    return (
      <div className='h-full flex flex-col justify-center items-center gap-4'>
        <p className='text-slate-400'>Conversación no encontrada</p>
        <Link href='/admin/conversations'>
          <Button variant='primary'>Volver a conversaciones</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='h-full overflow-y-auto custom-scrollbar p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='flex items-center gap-3'>
        <Link href='/admin/conversations'>
          <Button variant='ghostOutline' size='sm'>
            <ArrowLeft className='w-4 h-4' />
          </Button>
        </Link>
        <div className='flex-1'>
          <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
            {conversationDetail.title}
          </h1>
          <p className='text-[#9db2b9] text-sm'>
            Creada el {formatDate(conversationDetail.created_at)}
          </p>
        </div>
        {conversationDetail.is_active ? (
          <Badge variant='active'>Activa</Badge>
        ) : (
          <Badge variant='inactive'>Cerrada</Badge>
        )}
      </div>

      {/* Participantes */}
      <Card className='p-4 bg-slate-800 border-slate-700'>
        <h2 className='text-white text-lg font-bold mb-3 flex items-center gap-2'>
          <User className='w-5 h-5' />
          Participantes ({conversationDetail.participants.length})
        </h2>
        <div className='space-y-2'>
          {conversationDetail.participants.map((participant) => (
            <div
              key={participant.user_id}
              className='flex items-center gap-3 p-2 rounded bg-slate-700/50'
            >
              <Avatar className='h-10 w-10'>
                <AvatarImage src='' alt={participant.display_name} />
                <AvatarFallback>
                  {participant.display_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <p className='text-white text-sm font-medium'>
                  {participant.display_name}
                  {participant.is_owner && (
                    <Badge variant='admin' className='ml-2 text-xs'>
                      Propietario
                    </Badge>
                  )}
                </p>
                <p className='text-slate-400 text-xs'>{participant.email}</p>
              </div>
              <p className='text-slate-500 text-xs'>
                {formatDate(participant.added_at)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Mensajes */}
      <Card className='p-4 bg-slate-800 border-slate-700'>
        <h2 className='text-white text-lg font-bold mb-3 flex items-center gap-2'>
          <MessageSquare className='w-5 h-5' />
          Mensajes ({conversationDetail.messages.length})
        </h2>
        <div className='space-y-4'>
          {conversationDetail.messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.sender === 'user' ? 'bg-blue-900/20' : 'bg-slate-700/50'
              }`}
            >
              <div className='flex items-start gap-3 mb-2'>
                <Avatar className='h-8 w-8'>
                  <AvatarFallback>
                    {message.sender === 'user' ? 'U' : 'AI'}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-white text-sm font-medium'>
                      {message.sender === 'user'
                        ? message.sender_display_name || 'Usuario'
                        : 'Asistente'}
                    </span>
                    <span className='text-slate-500 text-xs'>
                      {formatDate(message.created_at)}
                    </span>
                    {message.latency_ms && (
                      <span className='text-slate-500 text-xs'>
                        ({message.latency_ms}ms)
                      </span>
                    )}
                  </div>
                  <p className='text-slate-300 text-sm whitespace-pre-wrap'>
                    {message.content}
                  </p>

                  {/* Feedback */}
                  {message.feedback && message.feedback.length > 0 && (
                    <div className='mt-3 space-y-2'>
                      <p className='text-slate-400 text-xs font-medium'>
                        Feedback:
                      </p>
                      {message.feedback.map((fb) => (
                        <div
                          key={fb.id}
                          className='p-2 bg-slate-800 rounded border border-slate-600'
                        >
                          <div className='flex items-center gap-2 mb-1'>
                            {getRatingIcon(fb.rating)}
                            <span className='text-white text-xs font-medium'>
                              {fb.user_display_name}
                            </span>
                            <span className='text-slate-500 text-xs'>
                              Rating: {fb.rating}/5
                            </span>
                            <span className='text-slate-500 text-xs ml-auto'>
                              {formatDate(fb.created_at)}
                            </span>
                          </div>
                          {fb.comment && (
                            <p className='text-slate-300 text-xs mt-1'>
                              {fb.comment}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
