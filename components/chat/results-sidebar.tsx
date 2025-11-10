'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { AISource } from '@/types/chat.types'
import { ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react'
import { useState } from 'react'

interface ResultsSidebarProps {
  sources?: AISource[]
  isLoading?: boolean
}

export default function ResultsSidebar({
  sources = [],
  isLoading,
}: ResultsSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Agrupar sources por archivo PDF
  const groupedSources = sources.reduce((acc, source) => {
    if (!acc[source.source]) {
      acc[source.source] = []
    }
    acc[source.source].push(source.chunk)
    return acc
  }, {} as Record<string, number[]>)

  // Contenido del sidebar (reutilizable para desktop y mobile)
  const SidebarContent = () => (
    <div className='space-y-4 overflow-y-auto flex-1 custom-scrollbar'>
      {sources.length > 0 ? (
        <>
          {/* Mostrar sources agrupados por documento */}
          {Object.entries(groupedSources).map(([filename, chunks]) => (
            <div
              key={filename}
              className='bg-gray-800/60 rounded-xl p-4 border border-gray-700/50 hover:bg-gray-800/80 transition-colors'
            >
              <div className='flex items-start gap-3 mb-3'>
                <div className='p-2 bg-blue-600/20 rounded-lg'>
                  <FileText className='w-5 h-5 text-blue-400' />
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='text-white text-sm font-medium leading-tight break-words'>
                    {filename}
                  </h3>
                  <p className='text-slate-400 text-xs mt-1'>
                    {chunks.length} fragmento(s) citado(s)
                  </p>
                </div>
              </div>

              {/* Lista de chunks */}
              <div className='space-y-1.5 mb-3'>
                {chunks
                  .sort((a, b) => a - b)
                  .map((chunk) => (
                    <div
                      key={chunk}
                      className='flex items-center gap-2 text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded'
                    >
                      <span className='w-1.5 h-1.5 bg-blue-400 rounded-full'></span>
                      <span>Fragmento #{chunk}</span>
                    </div>
                  ))}
              </div>

              <button className='w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105'>
                Ver Documento
              </button>
            </div>
          ))}
        </>
      ) : (
        <>
          {/* Mensaje cuando no hay sources */}
          <div className='flex flex-col items-center justify-center h-full text-center px-6 py-12'>
            <div className='p-4 bg-slate-800/50 rounded-full mb-4'>
              <Search className='w-12 h-12 text-slate-500' />
            </div>
            <h3 className='text-white text-lg font-semibold mb-2'>
              Aún no se han consultado tesis
            </h3>
            <p className='text-slate-400 text-sm leading-relaxed max-w-xs'>
              Realiza una consulta y aquí aparecerán las fuentes y documentos
              relacionados con tu búsqueda
            </p>
          </div>
        </>
      )}
    </div>
  )

  if (isCollapsed) {
    return (
      <>
        {/* Versión colapsada Desktop */}
        <div className='relative border-l border-gray-700 bg-gray-900/30 hidden lg:flex flex-col h-full w-12'>
          <button
            onClick={() => setIsCollapsed(false)}
            className='absolute top-4 left-1/2 -translate-x-1/2 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white'
            title='Expandir sidebar'
          >
            <ChevronLeft className='w-4 h-4' />
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Botón flotante móvil para abrir fuentes */}
      {sources.length > 0 && (
        <div className='lg:hidden fixed bottom-20 right-4 z-40'>
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button
                size='lg'
                className='rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-4'
              >
                <FileText className='w-5 h-5 mr-2' />
                <span className='font-medium'>
                  Fuentes ({Object.keys(groupedSources).length})
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='w-full sm:w-96 bg-gray-900 border-gray-700 p-0'
            >
              <div className='flex flex-col h-full'>
                <SheetHeader className='p-4 border-b border-gray-700'>
                  <SheetTitle className='text-white text-base font-semibold'>
                    Fuentes consultadas
                  </SheetTitle>
                  {isLoading && (
                    <p className='text-slate-400 text-sm mt-1'>Buscando...</p>
                  )}
                  {sources.length > 0 && !isLoading && (
                    <p className='text-slate-400 text-xs mt-1'>
                      {Object.keys(groupedSources).length} documento(s)
                      encontrado(s)
                    </p>
                  )}
                </SheetHeader>
                <div className='p-4 flex-1 overflow-hidden'>
                  <SidebarContent />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Sidebar Desktop */}
      <div className='w-80 lg:w-96 border-l border-gray-700 bg-gray-900/30 hidden lg:flex flex-col h-full'>
        <div className='p-4 border-b border-gray-700 flex-shrink-0 flex items-center justify-between'>
          <div className='flex-1'>
            <h2 className='text-white text-base font-semibold'>
              {sources.length > 0 ? 'Fuentes' : 'Tesis relacionadas'}
            </h2>
            {isLoading && (
              <p className='text-slate-400 text-sm mt-1'>Buscando...</p>
            )}
            {sources.length > 0 && !isLoading && (
              <p className='text-slate-400 text-xs mt-1'>
                {Object.keys(groupedSources).length} documento(s) encontrado(s)
              </p>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className='p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white'
            title='Colapsar sidebar'
          >
            <ChevronRight className='w-4 h-4' />
          </button>
        </div>

        <div className='p-4 flex-1 overflow-hidden'>
          <SidebarContent />
        </div>
      </div>
    </>
  )
}
