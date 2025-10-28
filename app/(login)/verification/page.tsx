"use client";

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from "next/link";
import { useAuth } from '@/hooks/useAuth'

const verificationSchema = z.object({
  code: z.string().min(6, 'El código debe tener 6 dígitos').max(6, 'El código debe tener 6 dígitos'),
})

type VerificationFormData = z.infer<typeof verificationSchema>

const VerificationPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verify } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('')

  const redirectUrl = searchParams.get('redirect') || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  })

  const watchedCode = watch('code')

  useEffect(() => {
    // Obtener el email de los parámetros de URL o localStorage
    const emailParam = searchParams.get('email')
    const storedEmail = localStorage.getItem('pendingVerificationEmail')

    if (emailParam) {
      setEmail(emailParam)
    } else if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // Si no hay email, redirigir al login
      router.push('/login')
    }
  }, [searchParams, router])

  const onSubmit = async (data: VerificationFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      await verify(email, data.code)

      // Limpiar email almacenado
      localStorage.removeItem('pendingVerificationEmail')

      router.push(redirectUrl)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Código de verificación inválido')
      } else {
        setError('Error desconocido')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const maskEmail = (email: string) => {
    if (!email) return 'tu correo'

    const [localPart, domain] = email.split('@')
    if (!domain) return email

    const maskedLocal = localPart.length > 2
      ? localPart.substring(0, 2) + '***' + localPart.slice(-1)
      : '***'

    return `${maskedLocal}@${domain}`
  }

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex justify-center items-center flex-1 py-5">
      <div className='w-full max-w-[512px] flex flex-col gap-5'>
        <h2 className='text-white text-[28px] font-bold text-center'>
          Verificación de cuenta
        </h2>

        <p className="text-white text-base font-normal text-center">
          Gracias por registrarte. Hemos enviado un código de verificación a {maskEmail(email)}.
          Por favor ingresa el código a continuación para verificar tu cuenta.
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="space-y-1">
            <Input
              placeholder="Código de verificación"
              className='h-13 pl-5'
              maxLength={6}
              {...register('code')}
              disabled={isLoading}
              autoComplete='one-time-code'
            />
            {errors.code && (
              <p className="text-sm text-red-400 px-2">{errors.code.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant='primary'
            className='w-full h-10 rounded-full'
            disabled={isLoading || !watchedCode || watchedCode.length !== 6}
          >
            {isLoading ? 'Verificando...' : 'Verificar cuenta'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            ¿No recibiste el código?{' '}
            <button
              type="button"
              className="text-blue-400 hover:text-blue-300 transition-colors"
              disabled={isLoading}
              onClick={() => {
                // Aquí podrías implementar reenvío de código
                console.log('Reenviar código a:', email)
              }}
            >
              Reenviar código
            </button>
          </p>
        </div>

        <div className="text-center">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VerificationPage;
