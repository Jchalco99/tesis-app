import { apiClient } from '@/lib/api';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
  roles: string[];
}

export interface UpdateProfileData {
  display_name?: string;
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
}

export interface ChangePasswordData {
  current_password?: string;
  new_password: string;
  confirm_password: string;
}

export interface UserStats {
  conversations_count: number;
  messages_sent: number;
  last_activity: string;
}

export class UserService {
  private static readonly BASE_URL = '/api/account';
  private static readonly AUTH_URL = '/auth';

  // Obtener perfil del usuario
  static async getProfile(): Promise<{ data: UserProfile }> {
    return apiClient.get<{ data: UserProfile }>(this.BASE_URL);
  }

  // Actualizar perfil
  static async updateProfile(data: UpdateProfileData): Promise<{ ok: boolean; message: string }> {
    return apiClient.put<{ ok: boolean; message: string }>(this.BASE_URL, data);
  }

  // Verificar si puede definir contraseña
  static async canSetPassword(): Promise<{ canSet: boolean; hasPassword: boolean }> {
    return apiClient.get<{ canSet: boolean; hasPassword: boolean }>(`${this.AUTH_URL}/set-password`);
  }

  // Cambiar contraseña (usando el endpoint correcto)
  static async changePassword(data: ChangePasswordData): Promise<{ ok: boolean; message?: string }> {
    return apiClient.post<{ ok: boolean; message?: string }>(`${this.AUTH_URL}/set-password`, {
      current_password: data.current_password,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    });
  }

  // Obtener estadísticas del usuario (simulado por ahora)
  static async getUserStats(): Promise<{ data: UserStats }> {
    // Como este endpoint probablemente no existe, simularemos los datos
    // Puedes implementarlo en tu backend o usar datos del chat
    return Promise.resolve({
      data: {
        conversations_count: 0,
        messages_sent: 0,
        last_activity: new Date().toISOString(),
      }
    });
  }
}
