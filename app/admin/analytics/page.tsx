'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAnalytics } from '@/hooks/useAnalytics'
import { Star } from 'lucide-react'
import { useEffect } from 'react'

export default function AnalyticsPage() {
  const { isLoading, feedbackSummary, loadFeedbackSummary } = useAnalytics()

  useEffect(() => {
    loadFeedbackSummary()
  }, [loadFeedbackSummary])

  const getRatingColor = (avgRating: number) => {
    if (avgRating >= 4.5) return 'text-green-400'
    if (avgRating >= 3.5) return 'text-blue-400'
    if (avgRating >= 2.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  // Helper para convertir rating a número de forma segura
  const parseRating = (rating: number | string | null | undefined): number => {
    if (typeof rating === 'number') return rating
    const parsed = parseFloat(rating as string)
    return isNaN(parsed) ? 0 : parsed
  }

  return (
    <div className='h-full overflow-y-auto custom-scrollbar p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
          Analíticas - Retroalimentación de Usuarios
        </h1>
        <p className='text-[#9db2b9] text-sm font-normal leading-normal'>
          Resumen de calificaciones y comentarios de los usuarios sobre las
          respuestas del asistente.
        </p>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400' />
        </div>
      ) : (
        <div className='px-4 overflow-x-auto'>
          <Table className='min-w-full'>
            <TableHeader>
              <TableRow className='bg-slate-700 hover:bg-slate-700/80'>
                <TableHead className='font-bold text-xs sm:text-sm'>
                  Usuario
                </TableHead>
                <TableHead className='font-bold text-xs sm:text-sm hidden sm:table-cell'>
                  Correo
                </TableHead>
                <TableHead className='font-bold text-xs sm:text-sm text-center'>
                  Total de Calificaciones
                </TableHead>
                <TableHead className='font-bold text-xs sm:text-sm text-center'>
                  Promedio
                </TableHead>
                <TableHead className='font-bold text-xs sm:text-sm hidden md:table-cell text-center'>
                  Distribución
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackSummary.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='text-center text-slate-400 py-8'
                  >
                    No hay datos de retroalimentación disponibles
                  </TableCell>
                </TableRow>
              ) : (
                feedbackSummary.map((user) => {
                  const avgRating = parseRating(user.avg_rating)

                  return (
                    <TableRow key={user.user_id}>
                      <TableCell className='text-xs sm:text-sm'>
                        <div className='flex flex-col'>
                          <span className='font-medium text-white'>
                            {user.display_name}
                          </span>
                          <span className='text-xs text-gray-400 sm:hidden'>
                            {user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm text-slate-300 hidden sm:table-cell'>
                        {user.email}
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm text-center'>
                        <Badge variant='user' className='text-xs'>
                          {user.total_ratings}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm text-center'>
                        <div
                          className={`flex items-center justify-center gap-1 ${getRatingColor(
                            avgRating
                          )}`}
                        >
                          <Star className='w-4 h-4 fill-current' />
                          <span className='font-bold'>
                            {avgRating.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='text-xs sm:text-sm hidden md:table-cell'>
                        <div className='flex gap-1 justify-center flex-wrap'>
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const count =
                              user[
                                `rating_${rating}_count` as keyof typeof user
                              ]
                            return (
                              <div
                                key={rating}
                                className='flex items-center gap-0.5 text-[10px] text-slate-400'
                              >
                                <span>{rating}★:</span>
                                <span className='text-white font-medium'>
                                  {count}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
