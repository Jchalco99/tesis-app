'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = () => {
      const error = searchParams.get('error');
      const success = searchParams.get('success');
      const email = searchParams.get('email');
      const redirect = searchParams.get('redirect') || '/';

      if (window.opener) {
        // Estamos en un popup
        if (error) {
          window.opener.postMessage({
            type: 'OAUTH_ERROR',
            error: decodeURIComponent(error)
          }, window.location.origin);
        } else if (success === 'true') {
          window.opener.postMessage({
            type: 'OAUTH_SUCCESS'
          }, window.location.origin);
        } else if (email) {
          window.opener.postMessage({
            type: 'OAUTH_REQUIRES_REGISTRATION',
            email: decodeURIComponent(email)
          }, window.location.origin);
        }
        window.close();
      } else {
        // Redirección completa
        if (error) {
          router.push(`/login?error=${error}`);
        } else if (success === 'true') {
          router.push(redirect);
        } else if (email) {
          router.push(`/register?google=1&email=${email}&redirect=${encodeURIComponent(redirect)}`);
        } else {
          router.push('/login');
        }
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex items-center gap-2 text-white">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Procesando autenticación...</span>
      </div>
    </div>
  );
}
