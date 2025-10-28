'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'registration'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Verificar si hay errores en los parámetros de URL
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          setStatus('error')
          setMessage(errorDescription || 'Error durante la autenticación con Google')

          // Si estamos en un popup, notificar al parent
          if (window.opener) {
            window.opener.postMessage({
              type: 'OAUTH_ERROR',
              error: errorDescription || 'Error durante la autenticación con Google'
            }, window.location.origin)
            window.close()
          } else {
            // Si no es popup, redirigir al login con error
            setTimeout(() => {
              router.push('/login?error=' + encodeURIComponent(errorDescription || 'Error de autenticación'))
            }, 2000)
          }
          return
        }

        // Hacer una llamada directa para verificar el estado después del callback de Google
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()

          if (data.isAuthenticated && data.user) {
            // Login exitoso - usuario ya existe
            setStatus('success')
            setMessage('¡Autenticación exitosa! Redirigiendo...')

            if (window.opener) {
              window.opener.postMessage({
                type: 'OAUTH_SUCCESS'
              }, window.location.origin)
              window.close()
            } else {
              const redirectUrl = searchParams.get('redirect') || '/'
              setTimeout(() => {
                router.push(redirectUrl)
              }, 2000)
            }
          } else {
            // Usuario no autenticado, pero sin error específico
            throw new Error('Usuario no autenticado después del callback')
          }
        } else {
          // La respuesta no es OK, verificar si indica que necesita registro
          const text = await response.text()
          let data

          try {
            data = JSON.parse(text)
          } catch (parseError) {
            throw new Error('Error parsing response from server')
          }

          if (data.requiresRegistration && data.email) {
            // Usuario necesita completar registro
            setStatus('registration')
            setMessage('Completando registro...')

            if (window.opener) {
              window.opener.postMessage({
                type: 'OAUTH_SUCCESS',
                requiresRegistration: true,
                email: data.email
              }, window.location.origin)
              window.close()
            } else {
              // Redirigir al registro con los datos de Google
              const registerUrl = new URL('/register', window.location.origin)
              registerUrl.searchParams.set('google', '1')
              registerUrl.searchParams.set('email', data.email)
              const redirectAfter = searchParams.get('redirect')
              if (redirectAfter) {
                registerUrl.searchParams.set('redirect', redirectAfter)
              }

              setTimeout(() => {
                router.push(registerUrl.toString())
              }, 2000)
            }
            return
          } else {
            // Otro tipo de error
            throw new Error(data.message || 'Error en la autenticación')
          }
        }
      } catch (error: unknown) {
        console.error('Error en callback OAuth:', error)
        setStatus('error')
        setMessage('Error procesando la autenticación')

        if (window.opener) {
          window.opener.postMessage({
            type: 'OAUTH_ERROR',
            error: 'Error procesando la autenticación'
          }, window.location.origin)
          window.close()
        } else {
          setTimeout(() => {
            router.push('/login?error=' + encodeURIComponent('Error procesando la autenticación'))
          }, 2000)
        }
      }
    }

    handleCallback()
  }, [searchParams, router, refreshUser])

  return (
    <div className="min-h-screen bg-[#121516] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white text-lg">Procesando autenticación...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-400 text-6xl">✓</div>
            <p className="text-white text-lg">{message}</p>
          </>
        )}

        {status === 'registration' && (
          <>
            <div className="text-blue-400 text-6xl">👤</div>
            <p className="text-white text-lg">{message}</p>
            <p className="text-gray-400 text-sm">Te redirigiremos para completar tu perfil</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-400 text-6xl">✗</div>
            <p className="text-red-400 text-lg">{message}</p>
            <p className="text-gray-400 text-sm">Serás redirigido automáticamente...</p>
          </>
        )}
      </div>
    </div>
  )
}
