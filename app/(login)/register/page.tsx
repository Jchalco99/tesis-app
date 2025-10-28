'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useAuthContext } from '@/providers/AuthProvider';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';

const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, isLoading, error, clearError } = useAuthContext();

  const [localError, setLocalError] = useState<string | null>(null);

  const redirectUrl = searchParams.get('redirect') || '/';
  const isGoogleFlow = searchParams.get('google') === '1';
  const googleEmail = searchParams.get('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Pre-llenar el email si viene de Google
  useEffect(() => {
    if (googleEmail) {
      setValue('email', googleEmail);
    }
  }, [googleEmail, setValue]);

  const watchedFields = watch(['firstName', 'lastName', 'email', 'password']);
  const isFormValid = watchedFields.every(field => field && field.length > 0);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      setLocalError(null);

      const displayName = `${data.firstName} ${data.lastName}`;

      const response = await registerUser(data.email, data.password, displayName);

      if (response.requiresVerification) {
        localStorage.setItem('pendingVerificationEmail', data.email);

        const verifyUrl = new URL('/verify', window.location.origin);
        verifyUrl.searchParams.set('email', data.email);
        if (redirectUrl !== '/') {
          verifyUrl.searchParams.set('redirect', redirectUrl);
        }

        router.push(verifyUrl.toString());
      } else {
        router.push(redirectUrl);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLocalError(error.message || 'Error al registrarse');
      } else {
        setLocalError('Error desconocido');
      }
    }
  };

  const handleGoogleSuccess = () => {
    router.push(redirectUrl);
  };

  const handleGoogleError = (error: string) => {
    setLocalError(error);
  };

  const handleGoogleRequiresRegistration = (email: string) => {
    setValue('email', email);
  };

  const displayError = error || localError;

  return (
    <div className='flex items-center justify-center flex-1 px-4 py-5 sm:px-10 md:px-20 lg:px-40'>
      <div className='w-full max-w-[512px] flex flex-col gap-6'>
        <h2 className='text-white text-[28px] font-bold text-center'>
          {isGoogleFlow ? 'Completa tu registro' : 'Crea tu cuenta'}
        </h2>

        {isGoogleFlow && (
          <Alert>
            <AlertDescription>
              {googleEmail
                ? `Completa tu registro para la cuenta ${googleEmail}`
                : 'Completa tu registro para continuar con Google'
              }
            </AlertDescription>
          </Alert>
        )}

        {displayError && (
          <Alert variant="destructive">
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div className='space-y-1'>
            <InputGroup className='h-12 pl-2'>
              <InputGroupInput
                type='text'
                placeholder='Ingrese su nombre'
                {...register('firstName')}
                disabled={isLoading}
              />
              <InputGroupAddon align='inline-end'>
                <User />
              </InputGroupAddon>
            </InputGroup>
            {errors.firstName && (
              <p className="text-sm text-red-400 px-2">{errors.firstName.message}</p>
            )}
          </div>

          <div className='space-y-1'>
            <InputGroup className='h-12 pl-2'>
              <InputGroupInput
                type='text'
                placeholder='Ingrese su apellido'
                {...register('lastName')}
                disabled={isLoading}
              />
              <InputGroupAddon align='inline-end'>
                <User />
              </InputGroupAddon>
            </InputGroup>
            {errors.lastName && (
              <p className="text-sm text-red-400 px-2">{errors.lastName.message}</p>
            )}
          </div>

          <div className='space-y-1'>
            <InputGroup className='h-12 pl-2'>
              <InputGroupInput
                type='email'
                placeholder='Email'
                {...register('email')}
                disabled={isLoading || isGoogleFlow}
                className={isGoogleFlow ? 'bg-gray-700 text-gray-300' : ''}
              />
              <InputGroupAddon align='inline-end'>
                <Mail />
              </InputGroupAddon>
            </InputGroup>
            {errors.email && (
              <p className="text-sm text-red-400 px-2">{errors.email.message}</p>
            )}
            {isGoogleFlow && (
              <p className="text-sm text-gray-400 px-2">Email desde Google</p>
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
              <p className="text-sm text-red-400 px-2">{errors.password.message}</p>
            )}
            {isGoogleFlow && (
              <p className="text-sm text-gray-400 px-2">
                Esta contraseña te permitirá acceder sin Google en el futuro
              </p>
            )}
          </div>

          <div className='flex flex-col gap-3 mt-2'>
            <Button
              type="submit"
              variant='primary'
              className='w-full h-10 rounded-full'
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? 'Registrando...' : (isGoogleFlow ? 'Completar registro' : 'Registrarse')}
            </Button>

            <Link href='/login'>
              <Button
                type="button"
                variant='primaryOutline'
                className='w-full h-10 rounded-full'
                disabled={isLoading}
              >
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </form>

        {!isGoogleFlow && (
          <>
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
                usePopup={true}
                showAccountSelector={true}
              />
            </div>
          </>
        )}

        {isGoogleFlow && (
          <div className='text-center'>
            <p className='text-sm text-gray-400'>
              ¿Prefieres usar otro email?{' '}
              <Link href='/register' className='text-blue-400 hover:text-blue-300'>
                Registrarse normalmente
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
