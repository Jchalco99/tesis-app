'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

type Props = {
  children: React.ReactNode;
};

const LoginLayout = ({ children }: Props) => {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center flex-1'>
        <div className='text-white text-lg'>Cargando...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <>
      {children}
    </>
  );
};

export default LoginLayout;
