'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthContext } from '@/providers/AuthProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const verificationSchema = z.object({
  code: z
    .string()
    .min(6, 'El código debe tener 6 dígitos')
    .max(6, 'El código debe tener 6 dígitos'),
})

type VerificationFormData = z.infer<typeof verificationSchema>

const VerificationPageContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verify, resendCode, isLoading, error, clearError } = useAuthContext()

  const [localError, setLocalError] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('')
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const redirectUrl = searchParams.get('redirect') || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  })

  const watchedCode = watch('code')

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const storedEmail = localStorage.getItem('pendingVerificationEmail')

    if (emailParam) {
      setEmail(emailParam)
    } else if (storedEmail) {
      setEmail(storedEmail)
    } else {
      router.push('/login')
    }
  }, [searchParams, router])

  const onSubmit = async (data: VerificationFormData) => {
    try {
      clearError()
      setLocalError(null)

      await verify(email, data.code)

      localStorage.removeItem('pendingVerificationEmail')

      router.push(redirectUrl)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLocalError(error.message || 'Código de verificación inválido')
      } else {
        setLocalError('Error desconocido')
      }
    }
  }

  const handleResendCode = async () => {
    try {
      setIsResending(true)
      setResendSuccess(false)
      clearError()
      setLocalError(null)

      await resendCode(email)
      setResendSuccess(true)

      setTimeout(() => {
        setResendSuccess(false)
      }, 3000)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLocalError(error.message || 'Error al reenviar código')
      } else {
        setLocalError('Error al reenviar código')
      }
    } finally {
      setIsResending(false)
    }
  }

  const maskEmail = (email: string) => {
    if (!email) return 'tu correo'

    const [localPart, domain] = email.split('@')
    if (!domain) return email

    const maskedLocal =
      localPart.length > 2
        ? localPart.substring(0, 2) + '***' + localPart.slice(-1)
        : '***'

    return `${maskedLocal}@${domain}`
  }

  const displayError = error || localError

  return (
    <div className='px-4 sm:px-10 md:px-20 lg:px-40 flex justify-center items-center flex-1 py-5'>
      <div className='w-full max-w-[512px] flex flex-col gap-5'>
        <h2 className='text-white text-[28px] font-bold text-center'>
          Verificación de cuenta
        </h2>

        <p className='text-white text-base font-normal text-center'>
          Gracias por registrarte. Hemos enviado un código de verificación a{' '}
          {maskEmail(email)}. Por favor ingresa el código a continuación para
          verificar tu cuenta.
        </p>

        {displayError && (
          <Alert variant='destructive'>
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        {resendSuccess && (
          <Alert className='border-green-500 text-green-400'>
            <AlertDescription>
              Se ha enviado un nuevo código de verificación a tu email.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          <div className='space-y-1'>
            <Input
              placeholder='Código de verificación'
              className='h-13 pl-5'
              maxLength={6}
              {...register('code')}
              disabled={isLoading}
              autoComplete='one-time-code'
            />
            {errors.code && (
              <p className='text-sm text-red-400 px-2'>{errors.code.message}</p>
            )}
          </div>

          <Button
            type='submit'
            variant='primary'
            className='w-full h-10 rounded-full'
            disabled={isLoading || !watchedCode || watchedCode.length !== 6}
          >
            {isLoading ? 'Verificando...' : 'Verificar cuenta'}
          </Button>
        </form>

        <div className='text-center'>
          <p className='text-sm text-gray-400'>
            ¿No recibiste el código?{' '}
            <button
              type='button'
              className='text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50'
              disabled={isLoading || isResending}
              onClick={handleResendCode}
            >
              {isResending ? 'Reenviando...' : 'Reenviar código'}
            </button>
          </p>
        </div>

        <div className='text-center'>
          <Link
            href='/login'
            className='text-sm text-gray-400 hover:text-white transition-colors'
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

const VerificationPage = () => {
  return (
    <Suspense
      fallback={
        <div className='px-4 sm:px-10 md:px-20 lg:px-40 flex justify-center items-center flex-1 py-5'>
          <div className='w-full max-w-[512px] flex flex-col gap-5'>
            <h2 className='text-white text-[28px] font-bold text-center'>
              Cargando...
            </h2>
          </div>
        </div>
      }
    >
      <VerificationPageContent />
    </Suspense>
  )
}

export default VerificationPage
