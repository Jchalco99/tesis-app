'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FaGoogle } from 'react-icons/fa'
import { useOAuth } from '@/hooks/useOAuth'

interface GoogleLoginButtonProps {
  className?: string
  disabled?: boolean
  usePopup?: boolean
  redirectUrl?: string
  onSuccess?: () => void
  onError?: (error: string) => void
  showAccountSelector?: boolean
}

export function GoogleLoginButton({
  className = 'w-full h-10 gap-2 rounded-full',
  disabled = false,
  usePopup = true,
  redirectUrl,
  onSuccess,
  onError,
  showAccountSelector = false
}: GoogleLoginButtonProps) {
  const {
    loginWithGoogle,
    clearGoogleSession,
    isLoading
  } = useOAuth({
    redirectUrl,
    onSuccess: () => {
      if (onSuccess) onSuccess()
    },
    onError: (err) => {
      if (onError) onError(err)
    }
  })

  const handleClick = () => {
    loginWithGoogle(usePopup, showAccountSelector)
  }

  const handleClearSession = async () => {
    await clearGoogleSession()
    // Esperar un poco y luego intentar login con selección de cuenta
    setTimeout(() => {
      loginWithGoogle(usePopup, true)
    }, 1000)
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant='ghost'
        className={className}
        onClick={handleClick}
        disabled={disabled || isLoading}
      >
        <FaGoogle className='w-4 h-4 text-white' />
        {isLoading ? 'Conectando...' : 'Continuar con Google'}
      </Button>
    </div>
  )
}
