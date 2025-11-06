'use client';

import { AuthService } from '@/services/auth.service';
import { useCallback, useState } from 'react';

interface OAuthOptions {
  redirectUrl?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onRequiresRegistration?: (email: string) => void;
}

export function useOAuth(options: OAuthOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = useCallback(async (usePopup = true, showAccountSelector = false) => {
    try {
      setIsLoading(true);

      const authUrl = AuthService.getGoogleAuthUrl(options.redirectUrl);
      const url = new URL(authUrl);

      if (showAccountSelector) {
        url.searchParams.set('prompt', 'select_account');
      }

      if (usePopup) {
        const popup = window.open(
          url.toString(),
          'google-oauth',
          'width=500,height=600,scrollbars=yes,resizable=yes,left=' +
          (window.screen.width / 2 - 250) + ',top=' + (window.screen.height / 2 - 300)
        );

        if (!popup) {
          throw new Error('No se pudo abrir la ventana emergente. Verifica que no esté bloqueada.');
        }

        const handleMessage = (event: MessageEvent) => {
          // Verificar el origen por seguridad
          if (event.origin !== window.location.origin) return;

          if (event.data.type === 'OAUTH_SUCCESS') {
            cleanup();
            // El popup se cierra a sí mismo, no intentamos cerrarlo desde aquí
            setIsLoading(false);
            options.onSuccess?.();
          } else if (event.data.type === 'OAUTH_ERROR') {
            cleanup();
            // El popup se cierra a sí mismo, no intentamos cerrarlo desde aquí
            setIsLoading(false);
            options.onError?.(event.data.error || 'Error en autenticación con Google');
          } else if (event.data.type === 'OAUTH_REQUIRES_REGISTRATION') {
            cleanup();
            // El popup se cierra a sí mismo, no intentamos cerrarlo desde aquí
            setIsLoading(false);

            // Llamar al callback si existe
            if (options.onRequiresRegistration && event.data.email) {
              options.onRequiresRegistration(event.data.email);
            } else if (event.data.email) {
              // Fallback: redirigir manualmente si no hay callback
              const registerUrl = new URL('/register', window.location.origin);
              registerUrl.searchParams.set('google', '1');
              registerUrl.searchParams.set('email', event.data.email);
              if (options.redirectUrl && options.redirectUrl !== '/') {
                registerUrl.searchParams.set('redirect', options.redirectUrl);
              }
              window.location.href = registerUrl.toString();
            } else {
              // Si no hay email, mostrar error
              options.onError?.('No se pudo obtener el email de Google');
            }
          }
        };

        const checkClosed = setInterval(() => {
          try {
            // Intentar acceder a popup.closed
            if (popup.closed) {
              cleanup();
              setIsLoading(false);
            }
          } catch {
            // Si hay error de COOP, ignorarlo
            // El popup se limpiará cuando reciba el mensaje o por timeout
          }
        }, 1000);

        // Timeout de seguridad: limpiar después de 5 minutos
        const timeout = setTimeout(() => {
          cleanup();
          setIsLoading(false);
        }, 300000);

        // Función de limpieza
        const cleanup = () => {
          clearInterval(checkClosed);
          clearTimeout(timeout);
          window.removeEventListener('message', handleMessage);
        };

        window.addEventListener('message', handleMessage);
      } else {
        // Redirección completa (sin popup)
        window.location.href = url.toString();
      }
    } catch (error: unknown) {
      setIsLoading(false);
      options.onError?.((error as Error).message || 'Error al iniciar sesión con Google');
    }
  }, [options]);

  const clearGoogleSession = useCallback(async (): Promise<void> => {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'https://accounts.google.com/logout';

      document.body.appendChild(iframe);

      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch {
            // Ignorar errores al remover iframe
          }
          resolve();
        }, 2000);
      });
    } catch (error) {
      console.error('Error clearing Google session:', error);
      return Promise.resolve();
    }
  }, []);

  return {
    loginWithGoogle,
    clearGoogleSession,
    isLoading,
  };
}
