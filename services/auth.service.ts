import { apiClient } from '@/lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  display_name: string;
}

export interface VerifyRequest {
  email?: string;  // Email es opcional si hay pendingUserId en sesión
  code: string;
}

export interface AuthResponse {
  ok: boolean;
  requiresVerification?: boolean;
  requiresGoogleLink?: boolean;
  email?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  is_active: boolean;
  roles: string[];
  created_at: string;
  last_login_at?: string;
}

export interface MeResponse {
  isAuthenticated: boolean;
  user?: User;
}

export class AuthService {
  private static readonly BASE_URL = '/auth';

  // Registro de usuario
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${this.BASE_URL}/register`, data);
  }

  // Login con email y contraseña
  static async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${this.BASE_URL}/login`, data);
  }

  // Verificar código de 2FA
  static async verify(data: VerifyRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${this.BASE_URL}/verify`, data);
  }

  // Cerrar sesión
  static async logout(): Promise<{ ok: boolean }> {
    return apiClient.post<{ ok: boolean }>(`${this.BASE_URL}/logout`);
  }

  // Obtener estado actual del usuario
  static async getMe(): Promise<MeResponse> {
    return apiClient.get<MeResponse>('/me');
  }

  // URLs para OAuth
  static getGoogleAuthUrl(redirectUrl?: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = new URL(`${baseUrl}/auth/google`);

    if (redirectUrl) {
      url.searchParams.set('redirect', redirectUrl);
    }

    return url.toString();
  }

  // Reenviar código de verificación
  static async resendVerificationCode(email: string): Promise<{ ok: boolean; message: string }> {
    return apiClient.post<{ ok: boolean; message: string }>(`${this.BASE_URL}/verify/resend`, { email });
  }
}
