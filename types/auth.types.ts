export type OAuthProvider = 'google' | 'github' | 'microsoft' | 'credentials'

export interface User {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  is_active: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
  roles?: string[]
}

export interface AuthResponse {
  ok: boolean
  user?: User
  requiresVerification?: boolean
  requiresGoogleLink?: boolean
  email?: string
  message?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  display_name: string
}

export interface VerificationData {
  email?: string
  code: string
}

export interface SetPasswordData {
  current_password?: string
  new_password: string
  confirm_password: string
}

export interface MeResponse {
  isAuthenticated: boolean
  user?: User
}

export interface Role {
  id: number
  name: string
  description?: string
  created_at: string
}

export interface UserRole {
  user_id: string
  role_id: number
  granted_at: string
}

export interface OAuthAccount {
  id: number
  user_id: string
  provider: OAuthProvider
  provider_account_id: string
  created_at: string
}

export interface Session {
  id: string
  user_id: string
  jti: string
  ip?: string
  user_agent?: string
  issued_at: string
  expires_at: string
  revoked_at?: string
  provider: OAuthProvider
}
