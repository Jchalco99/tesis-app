'use client'

import { useIsAdmin } from '@/hooks/useIsAdmin'
import { useAuthContext } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Props = {
  children: React.ReactNode
}

export function AdminRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuthContext()
  const isAdmin = useIsAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      router.push('/')
    }
  }, [isAuthenticated, isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#0f1011]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4' />
          <p className='text-gray-400'>Verificando permisos...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#0f1011]'>
        <div className='text-center'>
          <p className='text-gray-400'>Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
