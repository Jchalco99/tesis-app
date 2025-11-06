'use client'

import { Button } from '@/components/ui/button'
import { useOAuth } from '@/hooks/useOAuth'
import { FaGoogle } from 'react-icons/fa'

interface GoogleLoginButtonProps {
  className?: string
  disabled?: boolean
  usePopup?: boolean
  redirectUrl?: string
  onSuccess?: () => void
  onError?: (error: string) => void
  onRequiresRegistration?: (email: string) => void
  onRequiresVerification?: (email: string) => void
  showAccountSelector?: boolean
}

export function GoogleLoginButton({
  className = 'w-full h-10 gap-2 rounded-full',
  disabled = false,
  usePopup = true,
  redirectUrl,
  onSuccess,
  onError,
  onRequiresRegistration,
  onRequiresVerification,
  showAccountSelector = false,
}: GoogleLoginButtonProps) {
  const { loginWithGoogle, isLoading } = useOAuth({
    redirectUrl,
    onSuccess,
    onError,
    onRequiresRegistration,
    onRequiresVerification,
  })

  return (
    <div className='space-y-3'>
      <Button
        type='button'
        variant='ghost'
        className={className}
        onClick={() => loginWithGoogle(usePopup, showAccountSelector)}
        disabled={disabled || isLoading}
      >
        <FaGoogle className='w-4 h-4 text-white' />
        {isLoading ? 'Conectando...' : 'Continuar con Google'}
      </Button>
    </div>
  )
}
