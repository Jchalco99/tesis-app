'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleOAuthService } from '@/services/google.service'
import { useAuth } from '@/hooks/useAuth'

interface UseOAuthOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
  onRequiresRegistration?: (email: string) => void
  redirectUrl?: string
}

export function useOAuth(options?: UseOAuthOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refreshUser } = useAuth()
  const router = useRouter()

  const loginWithGoogle = useCallback(async (usePopup: boolean = true, forceAccountSelection = false) => {
    try {
      setIsLoading(true)
      setError(null)

      if (usePopup) {
        const result = await GoogleOAuthService.loginWithPopup(forceAccountSelection)

        if (result.success) {
          if (result.requiresRegistration && result.email) {
            // El usuario necesita completar su registro
            if (options?.onRequiresRegistration) {
              options.onRequiresRegistration(result.email)
            } else {
              // Redirigir al registro con parámetros de Google
              const registerUrl = new URL('/register', window.location.origin)
              registerUrl.searchParams.set('google', '1')
              registerUrl.searchParams.set('email', result.email)
              if (options?.redirectUrl) {
                registerUrl.searchParams.set('redirect', options.redirectUrl)
              }
              router.push(registerUrl.toString())
            }
          } else {
            // Login exitoso, refrescar el estado del usuario
            await refreshUser()

            if (options?.onSuccess) {
              options.onSuccess()
            } else {
              router.push(options?.redirectUrl || '/')
            }
          }
        } else {
          setError(result.error || 'Error durante la autenticación')
          if (options?.onError) {
            options.onError(result.error || 'Error durante la autenticación')
          }
        }
      } else {
        // Redirigir directamente
        GoogleOAuthService.loginWithRedirect(forceAccountSelection)
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Error inesperado durante la autenticación'
      setError(errorMessage)
      if (options?.onError) {
        options.onError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [options, refreshUser, router])

  const clearGoogleSession = useCallback(async () => {
    try {
      await GoogleOAuthService.clearGoogleSession()
    } catch (error) {
      console.error('Error limpiando sesión de Google:', error)
    }
  }, [])

  const checkCanSetPassword = useCallback(async (): Promise<boolean> => {
    try {
      return await GoogleOAuthService.canSetPassword()
    } catch (error) {
      console.error('Error verificando contraseña:', error)
      return false
    }
  }, [])

  const setPassword = useCallback(async (newPassword: string, confirmPassword: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await GoogleOAuthService.setPassword(newPassword, confirmPassword)
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Error al establecer contraseña'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loginWithGoogle,
    clearGoogleSession,
    checkCanSetPassword,
    setPassword,
    isLoading,
    error,
    resetError
  }
}
