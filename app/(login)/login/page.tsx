'use client'

import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { useAuthContext } from '@/providers/AuthProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import TypeWriter from 'typewriter-effect'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading, error, clearError, checkAuth } = useAuthContext()

  const [localError, setLocalError] = useState<string | null>(null)

  const redirectUrl = searchParams.get('redirect') || '/'
  const urlError = searchParams.get('error')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const watchedEmail = watch('email')
  const watchedPassword = watch('password')

  // Mostrar error de URL si existe
  useState(() => {
    if (urlError) {
      setLocalError(decodeURIComponent(urlError))
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError()
      setLocalError(null)

      const response = await login(data.email, data.password)

      if (response.requiresVerification) {
        localStorage.setItem(
          'pendingVerificationEmail',
          response.email || data.email
        )

        const verifyUrl = new URL('/verification', window.location.origin)
        verifyUrl.searchParams.set('email', response.email || data.email)
        if (redirectUrl !== '/') {
          verifyUrl.searchParams.set('redirect', redirectUrl)
        }

        router.push(verifyUrl.toString())
      } else {
        router.push(redirectUrl)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLocalError(error.message || 'Error al iniciar sesión')
      } else {
        setLocalError('Error desconocido')
      }
    }
  }

  const handleGoogleSuccess = async () => {
    // Actualizar el estado del usuario después de login exitoso
    await checkAuth()
    router.push(redirectUrl)
  }

  const handleGoogleError = (error: string) => {
    setLocalError(error)
  }

  const handleGoogleRequiresRegistration = (email: string) => {
    const registerUrl = new URL('/register', window.location.origin)
    registerUrl.searchParams.set('google', '1')
    registerUrl.searchParams.set('email', email)
    if (redirectUrl !== '/') {
      registerUrl.searchParams.set('redirect', redirectUrl)
    }
    router.push(registerUrl.toString())
  }

  const handleGoogleRequiresVerification = (email: string) => {
    const verifyUrl = new URL('/verification', window.location.origin)
    verifyUrl.searchParams.set('email', email)
    if (redirectUrl !== '/') {
      verifyUrl.searchParams.set('redirect', redirectUrl)
    }
    router.push(verifyUrl.toString())
  }

  const displayError = error || localError

  return (
    <div className='flex items-center justify-center flex-1 px-4 py-5 sm:px-10 md:px-20 lg:px-40'>
      <div className='w-full max-w-[512px] flex flex-col gap-6'>
        <h2 className='text-white text-[28px] font-bold text-center'>
          <TypeWriter
            options={{
              strings: ['TECSUP', 'Iniciar sesión', 'Bienvenido de nuevo'],
              autoStart: true,
              loop: true,
              delay: 200,
              deleteSpeed: 100,
            }}
          />
        </h2>

        {displayError && (
          <Alert variant='destructive'>
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
          <div className='space-y-1'>
            <InputGroup className='h-12 pl-2'>
              <InputGroupInput
                type='email'
                placeholder='Email'
                {...register('email')}
                disabled={isLoading}
              />
              <InputGroupAddon align='inline-end'>
                <Mail />
              </InputGroupAddon>
            </InputGroup>
            {errors.email && (
              <p className='text-sm text-red-400 px-2'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className='space-y-1'>
            <InputGroup className='h-12 pl-2'>
              <InputGroupInput
                type='password'
                placeholder='Contraseña'
                {...register('password')}
                disabled={isLoading}
              />
              <InputGroupAddon align='inline-end'>
                <Lock />
              </InputGroupAddon>
            </InputGroup>
            {errors.password && (
              <p className='text-sm text-red-400 px-2'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-3 mt-3'>
            <Button
              type='submit'
              variant='primary'
              className='w-full h-10 rounded-full'
              disabled={isLoading || !watchedEmail || !watchedPassword}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>

            <Link href='/register'>
              <Button
                type='button'
                variant='primaryOutline'
                className='w-full h-10 rounded-full'
                disabled={isLoading}
              >
                Registrarse
              </Button>
            </Link>
          </div>
        </form>

        <div className='flex items-center justify-center'>
          <p className='mb-3 text-sm text-gray-400'>o</p>
        </div>

        <div className='text-center'>
          <GoogleLoginButton
            disabled={isLoading}
            redirectUrl={redirectUrl}
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            onRequiresRegistration={handleGoogleRequiresRegistration}
            onRequiresVerification={handleGoogleRequiresVerification}
            usePopup={true}
            showAccountSelector={false}
          />
        </div>

        <div className='text-center'>
          <Link
            href='/forgot-password'
            className='text-sm text-gray-400 hover:text-white transition-colors'
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
