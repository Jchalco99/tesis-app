/**
 * Servicio para manejar OAuth con Google
 */

import { apiClient } from '@/lib/api'
import { API_ENDPOINTS } from '@/lib/constants'

export interface OAuthResponse {
  ok: boolean
  requiresRegistration?: boolean
  requiresGoogleLink?: boolean
  email?: string
  user?: unknown
  message?: string
}

export class GoogleOAuthService {
  private static readonly POPUP_CONFIG = {
    width: 500,
    height: 600,
    scrollbars: 'yes',
    resizable: 'yes'
  }

  /**
   * Obtiene la URL de autorización de Google con parámetros para forzar selección de cuenta
   */
  static getAuthUrl(forceAccountSelection = false): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    let authUrl = `${apiUrl}${API_ENDPOINTS.AUTH.GOOGLE}`

    // Agregar parámetros para forzar selección de cuenta
    if (forceAccountSelection) {
      authUrl += '?prompt=select_account'
    }

    return authUrl
  }

  /**
   * Limpia la sesión de Google OAuth en el navegador
   */
  static async clearGoogleSession(): Promise<void> {
    try {
      // Intentar cerrar sesión de Google
      const googleLogoutUrl = 'https://accounts.google.com/logout'

      // Crear un iframe oculto para hacer logout de Google
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = googleLogoutUrl
      document.body.appendChild(iframe)

      // Remover el iframe después de un tiempo
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 2000)

      // También limpiar localStorage relacionado con Google
      Object.keys(localStorage).forEach(key => {
        if (key.includes('google') || key.includes('oauth') || key.includes('gapi')) {
          localStorage.removeItem(key)
        }
      })

      // Limpiar sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('google') || key.includes('oauth') || key.includes('gapi')) {
          sessionStorage.removeItem(key)
        }
      })

    } catch (error) {
      console.error('Error limpiando sesión de Google:', error)
    }
  }

  /**
   * Inicia el flujo OAuth con opción de forzar selección de cuenta
   */
  static async loginWithPopup(forceAccountSelection = false): Promise<{
    success: boolean
    requiresRegistration?: boolean
    email?: string
    error?: string
  }> {
    return new Promise((resolve) => {
      const authUrl = this.getAuthUrl(forceAccountSelection)
      const popup = this.openPopup(authUrl)

      if (!popup) {
        resolve({
          success: false,
          error: 'No se pudo abrir la ventana emergente. Verifica que los popups estén habilitados.'
        })
        return
      }

      // Configurar el listener para el mensaje del popup
      const messageListener = (event: MessageEvent) => {
        // Verificar el origen por seguridad
        const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin
        if (event.origin !== frontendUrl) {
          return
        }

        if (event.data.type === 'OAUTH_SUCCESS') {
          cleanup()
          resolve({
            success: true,
            requiresRegistration: event.data.requiresRegistration,
            email: event.data.email
          })
        } else if (event.data.type === 'OAUTH_ERROR') {
          cleanup()
          resolve({
            success: false,
            error: event.data.error || 'Error durante la autenticación con Google'
          })
        }
      }

      // Configurar el polling para detectar si el popup se cierra manualmente
      const pollTimer = setInterval(() => {
        if (popup.closed) {
          cleanup()
          resolve({
            success: false,
            error: 'Ventana de autenticación cerrada por el usuario'
          })
        }
      }, 1000)

      // Timeout después de 5 minutos
      const timeout = setTimeout(() => {
        cleanup()
        resolve({
          success: false,
          error: 'Tiempo de espera agotado para la autenticación'
        })
      }, 300000)

      const cleanup = () => {
        window.removeEventListener('message', messageListener)
        clearInterval(pollTimer)
        clearTimeout(timeout)
        if (!popup.closed) {
          popup.close()
        }
      }

      window.addEventListener('message', messageListener)
    })
  }

  /**
   * Inicia el flujo OAuth redirigiendo la ventana principal
   */
  static loginWithRedirect(forceAccountSelection = false): void {
    const authUrl = this.getAuthUrl(forceAccountSelection)
    window.location.href = authUrl
  }

  /**
   * Abre una ventana popup con la configuración apropiada
   */
  private static openPopup(url: string): Window | null {
    const { width, height, scrollbars, resizable } = this.POPUP_CONFIG

    // Calcular la posición para centrar el popup
    const left = (window.screen.width / 2) - (width / 2)
    const top = (window.screen.height / 2) - (height / 2)

    const features = [
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      `scrollbars=${scrollbars}`,
      `resizable=${resizable}`,
      'status=no',
      'menubar=no',
      'toolbar=no',
      'location=no'
    ].join(',')

    return window.open(url, 'google_oauth', features)
  }

  /**
   * Verifica si el usuario puede establecer contraseña (para usuarios OAuth)
   */
  static async canSetPassword(): Promise<boolean> {
    try {
      const response = await apiClient.get<{ canSetPassword: boolean }>(
        API_ENDPOINTS.AUTH.SET_PASSWORD
      )
      return response.canSetPassword
    } catch (error) {
      console.error('Error verificando si puede establecer contraseña:', error)
      return false
    }
  }

  /**
   * Establece contraseña para usuarios OAuth
   */
  static async setPassword(newPassword: string, confirmPassword: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.SET_PASSWORD, {
        new_password: newPassword,
        confirm_password: confirmPassword
      })
    } catch (error: unknown) {
      throw error
    }
  }
}
