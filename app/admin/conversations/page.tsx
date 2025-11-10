'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAnalytics } from '@/hooks/useAnalytics'
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Search,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ConversationsPage() {
  const { isLoading, conversations, conversationsTotal, loadConversations } =
    useAnalytics()

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 20

  useEffect(() => {
    loadConversations({
      page: currentPage,
      limit,
      q: searchQuery || undefined,
    })
  }, [loadConversations, currentPage, searchQuery])

  const totalPages = Math.ceil(conversationsTotal / limit)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on search
    loadConversations({ page: 1, limit, q: searchQuery || undefined })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className='h-full overflow-y-auto custom-scrollbar p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
          Gestión de Conversaciones
        </h1>
        <p className='text-[#9db2b9] text-sm font-normal leading-normal'>
          Administra y revisa todas las conversaciones de la plataforma.
        </p>
      </div>

      <form onSubmit={handleSearch} className='px-4 py-3'>
        <InputGroup className='h-10 max-w-md'>
          <InputGroupInput
            placeholder='Buscar por título'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search className='w-4 h-4' />
          </InputGroupAddon>
        </InputGroup>
      </form>

      {isLoading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400' />
        </div>
      ) : (
        <>
          <div className='px-4 overflow-x-auto'>
            <Table className='min-w-full'>
              <TableHeader>
                <TableRow className='bg-slate-700 hover:bg-slate-700/80'>
                  <TableHead className='font-bold text-xs sm:text-sm'>
                    Título
                  </TableHead>
                  <TableHead className='font-bold text-xs sm:text-sm hidden md:table-cell'>
                    Propietario
                  </TableHead>
                  <TableHead className='font-bold text-xs sm:text-sm text-center'>
                    Mensajes
                  </TableHead>
                  <TableHead className='font-bold text-xs sm:text-sm text-center hidden sm:table-cell'>
                    Rating
                  </TableHead>
                  <TableHead className='font-bold text-xs sm:text-sm'>
                    Estado
                  </TableHead>
                  <TableHead className='font-bold text-xs sm:text-sm'>
                    Fecha
                  </TableHead>
                  <TableHead className='font-bold text-xs sm:text-sm'>
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='text-center text-slate-400 py-8'
                    >
                      No se encontraron conversaciones
                    </TableCell>
                  </TableRow>
                ) : (
                  conversations.map((conv) => (
                    <TableRow key={conv.conversation_id}>
                      <TableCell className='text-xs sm:text-sm max-w-[200px]'>
                        <div className='flex flex-col'>
                          <span className='font-medium text-white truncate'>
                            {conv.title}
                          </span>
                          <span className='text-xs text-gray-400 md:hidden'>
                            {conv.owner_display_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm text-slate-300 hidden md:table-cell'>
                        <div className='flex flex-col'>
                          <span>{conv.owner_display_name}</span>
                          <span className='text-xs text-gray-400'>
                            {conv.owner_email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm text-center'>
                        <Badge variant='user' className='text-xs'>
                          <MessageSquare className='w-3 h-3 mr-1' />
                          {conv.total_messages}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm text-center hidden sm:table-cell'>
                        {conv.avg_rating ? (
                          <div className='flex items-center justify-center gap-1 text-yellow-400'>
                            <Star className='w-3 h-3 fill-current' />
                            <span>
                              {typeof conv.avg_rating === 'number'
                                ? conv.avg_rating.toFixed(1)
                                : parseFloat(conv.avg_rating as string).toFixed(
                                    1
                                  )}
                            </span>
                            <span className='text-xs text-gray-400'>
                              ({conv.total_ratings})
                            </span>
                          </div>
                        ) : (
                          <span className='text-gray-500 text-xs'>
                            Sin calificación
                          </span>
                        )}
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm'>
                        {conv.is_active ? (
                          <Badge variant='active' className='text-xs'>
                            Activa
                          </Badge>
                        ) : (
                          <Badge variant='inactive' className='text-xs'>
                            Cerrada
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm text-slate-300'>
                        {formatDate(conv.created_at)}
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm'>
                        <Link
                          href={`/admin/conversations/${conv.conversation_id}`}
                        >
                          <Button
                            variant='primaryOutline'
                            size='sm'
                            className='text-xs'
                          >
                            Ver
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className='flex items-center justify-between px-4 py-3'>
              <div className='text-sm text-slate-400'>
                Mostrando {(currentPage - 1) * limit + 1} -{' '}
                {Math.min(currentPage * limit, conversationsTotal)} de{' '}
                {conversationsTotal} conversaciones
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='ghostOutline'
                  size='sm'
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className='w-4 h-4' />
                </Button>
                <div className='flex items-center gap-1 text-sm text-slate-300'>
                  <span>Página</span>
                  <span className='font-bold'>{currentPage}</span>
                  <span>de</span>
                  <span className='font-bold'>{totalPages}</span>
                </div>
                <Button
                  variant='ghostOutline'
                  size='sm'
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className='w-4 h-4' />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
