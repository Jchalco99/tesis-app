'use client'

import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = () => {
      const error = searchParams.get('error')
      const success = searchParams.get('success')
      const email = searchParams.get('email')
      const requiresRegistration = searchParams.get('requiresRegistration')
      const redirect = searchParams.get('redirect') || '/'

      if (window.opener) {
        // Estamos en un popup
        if (error) {
          window.opener.postMessage(
            {
              type: 'OAUTH_ERROR',
              error: decodeURIComponent(error),
            },
            window.location.origin
          )
        } else if (success === 'true') {
          window.opener.postMessage(
            {
              type: 'OAUTH_SUCCESS',
            },
            window.location.origin
          )
        } else if (requiresRegistration === 'true' && email) {
          // Usuario necesita registrarse
          window.opener.postMessage(
            {
              type: 'OAUTH_REQUIRES_REGISTRATION',
              email: decodeURIComponent(email),
            },
            window.location.origin
          )
        } else if (email) {
          // Fallback por compatibilidad
          window.opener.postMessage(
            {
              type: 'OAUTH_REQUIRES_REGISTRATION',
              email: decodeURIComponent(email),
            },
            window.location.origin
          )
        } else {
          // Error desconocido
          window.opener.postMessage(
            {
              type: 'OAUTH_ERROR',
              error: 'Error desconocido en el proceso de autenticación',
            },
            window.location.origin
          )
        }

        // Cerrar el popup después de un pequeño delay para asegurar que el mensaje se envíe
        setTimeout(() => {
          window.close()
        }, 100)
      } else {
        // Redirección completa (sin popup)
        if (error) {
          router.push(`/login?error=${error}`)
        } else if (success === 'true') {
          router.push(redirect)
        } else if ((requiresRegistration === 'true' || email) && email) {
          // Redirigir al registro con el email
          const registerUrl = new URL('/register', window.location.origin)
          registerUrl.searchParams.set('google', '1')
          registerUrl.searchParams.set('email', decodeURIComponent(email))
          if (redirect !== '/') {
            registerUrl.searchParams.set('redirect', redirect)
          }
          router.push(registerUrl.toString())
        } else {
          router.push('/login')
        }
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-900'>
      <div className='flex items-center gap-2 text-white'>
        <Loader2 className='w-5 h-5 animate-spin' />
        <span>Procesando autenticación...</span>
      </div>
    </div>
  )
}
