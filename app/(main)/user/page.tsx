'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserProfile from './user-profile';
import InfoSection from './info-section';
import ChangePasswordModal from '@/components/user/change-password-modal';
import { useUser } from '@/hooks/useUser';
import { useAuthContext } from '@/providers/AuthProvider';
import { LogOut, Edit, UserX, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function UserPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { profile, stats, isLoading } = useUser();
  const { logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Opcional: mostrar un toast o mensaje de error
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Cargando perfil...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold">Error al cargar el perfil</p>
          <p className="text-sm mt-2">Por favor, intenta nuevamente</p>
        </div>
      </div>
    );
  }

  const userInfo = [
    { label: 'Nombre', value: profile.display_name },
    { label: 'Correo Electrónico', value: profile.email },
    { label: 'Estado', value: profile.is_active ? 'Activo' : 'Inactivo' },
  ];

  const userActivity = [
    {
      label: 'Fecha de Registro',
      value: new Date(profile.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    {
      label: 'Último Acceso',
      value: profile.last_login_at
        ? new Date(profile.last_login_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'Nunca'
    },
    {
      label: 'Conversaciones Creadas',
      value: stats?.conversations_count?.toString() || '0'
    },
    {
      label: 'Mensajes Enviados',
      value: stats?.messages_sent?.toString() || '0'
    },
  ];

  return (
    <div className='p-3 md:p-6 space-y-4 md:space-y-6'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
          Perfil de Usuario
        </h1>
        <p className='text-slate-400 text-sm'>
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className='p-4'>
        <UserProfile
          name={profile.display_name}
          email={profile.email}
          src={profile.avatar_url || 'https://github.com/shadcn.png'}
          alt={profile.display_name}
          fallback={profile.display_name.slice(0, 2).toUpperCase()}
        />
      </div>

      <InfoSection
        title="Información del Usuario"
        items={userInfo}
      />

      <InfoSection
        title="Actividad del Usuario"
        items={userActivity}
      />

      {/* Sección de acciones */}
      <div className='px-4 py-4'>
        <h2 className='text-white text-lg font-semibold mb-4'>
          Acciones de Cuenta
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
          <Link href='/user/edit'>
            <Button variant='ghost' className='w-full'>
              <Edit className='w-4 h-4 mr-2' />
              Editar Información
            </Button>
          </Link>

          <ChangePasswordModal />

          <Button
            variant='danger'
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Cerrando...
              </>
            ) : (
              <>
                <LogOut className='w-4 h-4 mr-2' />
                Cerrar Sesión
              </>
            )}
          </Button>

          <Button variant='default' className='w-full sm:w-auto'>
            <UserX className='w-4 h-4 mr-2' />
            Suspender Cuenta
          </Button>
        </div>
      </div>
    </div>
  );
}
