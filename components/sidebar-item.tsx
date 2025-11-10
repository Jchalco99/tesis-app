'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { MoreVertical, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface SidebarItemProps {
  label: string
  href: string
  icon: React.ReactNode
  isCollapsed?: boolean
  onClick?: () => void
  onDelete?: () => void
  showMenu?: boolean
}

export function SidebarItem({
  label,
  href,
  icon,
  isCollapsed = false,
  onClick,
  onDelete,
  showMenu = false,
}: SidebarItemProps) {
  const pathname = usePathname()
  const isActive =
    pathname === href || (href !== '/' && pathname.startsWith(href))
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(false)

    if (onDelete) {
      onDelete()
    }
  }

  return (
    <div className='relative group'>
      <Link
        href={href}
        onClick={handleClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          'hover:bg-slate-700/50 hover:text-white',
          isActive ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-300',
          isCollapsed && 'justify-center px-2'
        )}
        title={isCollapsed ? label : undefined}
      >
        <div className='flex-shrink-0'>{icon}</div>
        {!isCollapsed && (
          <span className='truncate flex-1 text-left'>{label}</span>
        )}

        {/* Menú de opciones para conversaciones */}
        {!isCollapsed && showMenu && (
          <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger asChild>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsMenuOpen(!isMenuOpen)
                }}
                className={cn(
                  'flex-shrink-0 p-1 rounded hover:bg-slate-600 transition-colors opacity-0 group-hover:opacity-100',
                  isMenuOpen && 'opacity-100'
                )}
                title='Opciones'
              >
                <MoreVertical className='w-4 h-4' />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className='w-48 p-1 bg-slate-800 border-slate-700'
              align='end'
              side='right'
              sideOffset={5}
            >
              <button
                onClick={handleDelete}
                className='flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded transition-colors'
              >
                <Trash2 className='w-4 h-4' />
                <span>Eliminar conversación</span>
              </button>
            </PopoverContent>
          </Popover>
        )}
      </Link>
    </div>
  )
}
