'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Props = {
  children: React.ReactNode
}

const LoginLayout = ({ children }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Permitir acceso a /verification incluso si está autenticado
    if (pathname?.startsWith('/verification')) {
      return
    }

    // Si está autenticado y en login/register, redirigir a home
    if (!isLoading && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center flex-1'>
        <div className='text-white text-lg'>Cargando...</div>
      </div>
    )
  }

  // Permitir acceso a /verification siempre (autenticado o no)
  if (pathname?.startsWith('/verification')) {
    return <>{children}</>
  }

  // Si está autenticado y NO está en /verification, no mostrar login/register
  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default LoginLayout
