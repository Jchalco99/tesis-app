'use client';

import { useState, useCallback } from 'react';
import { AuthService } from '@/services/auth.service';

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
          if (event.origin !== window.location.origin) return;

          if (event.data.type === 'OAUTH_SUCCESS') {
            popup.close();
            window.removeEventListener('message', handleMessage);
            setIsLoading(false);
            options.onSuccess?.();
          } else if (event.data.type === 'OAUTH_ERROR') {
            popup.close();
            window.removeEventListener('message', handleMessage);
            setIsLoading(false);
            options.onError?.(event.data.error || 'Error en autenticación con Google');
          } else if (event.data.type === 'OAUTH_REQUIRES_REGISTRATION') {
            popup.close();
            window.removeEventListener('message', handleMessage);
            setIsLoading(false);
            options.onRequiresRegistration?.(event.data.email);
          }
        };

        window.addEventListener('message', handleMessage);

        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', handleMessage);
            setIsLoading(false);
          }
        }, 1000);
      } else {
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
          } catch (e) {
            // Ignorar errores
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
