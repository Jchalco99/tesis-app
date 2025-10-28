import { User, OAuthProvider } from '@/types/auth.types'

export function hasRole(user: User | null, role: string): boolean {
  if (!user || !user.roles) return false
  return user.roles.includes(role)
}

export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'admin')
}

export function isActiveUser(user: User | null): boolean {
  return user?.is_active === true
}

export function getUserInitials(displayName: string): string {
  return displayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatLastLogin(lastLoginAt: string | null): string {
  if (!lastLoginAt) return 'Nunca'

  const date = new Date(lastLoginAt)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) return 'Hace menos de una hora'
  if (diffInHours < 24) return `Hace ${Math.floor(diffInHours)} horas`
  if (diffInHours < 48) return 'Ayer'

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe tener al menos una mayúscula')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe tener al menos una minúscula')
  }

  if (!/\d/.test(password)) {
    errors.push('La contraseña debe tener al menos un número')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function getGoogleAuthUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  return `${apiUrl}/auth/google`
}

export function handleOAuthPopup(url: string): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const popup = window.open(
      url,
      'oauth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    )

    if (!popup) {
      resolve({ success: false, error: 'No se pudo abrir la ventana emergente' })
      return
    }

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        resolve({ success: true })
      }
    }, 1000)

    setTimeout(() => {
      clearInterval(checkClosed)
      if (!popup.closed) {
        popup.close()
      }
      resolve({ success: false, error: 'Tiempo de espera agotado' })
    }, 300000)
  })
}
