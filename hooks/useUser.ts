'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserService, UserProfile, UpdateProfileData, ChangePasswordData, UserStats } from '@/services/user.service';

interface UserState {
  profile: UserProfile | null;
  stats: UserStats | null;
  isLoading: boolean;
  isUpdating: boolean;
  isChangingPassword: boolean;
  error: string | null;
}

export function useUser() {
  const [state, setState] = useState<UserState>({
    profile: null,
    stats: null,
    isLoading: false,
    isUpdating: false,
    isChangingPassword: false,
    error: null,
  });

  // Cargar perfil del usuario
  const loadProfile = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await UserService.getProfile();
      setState(prev => ({
        ...prev,
        profile: response.data,
        isLoading: false
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message || 'Error al cargar perfil'
      }));
    }
  }, []);

  // Cargar estadísticas del usuario
  const loadStats = useCallback(async () => {
    try {
      const response = await UserService.getUserStats();
      setState(prev => ({
        ...prev,
        stats: response.data
      }));
    } catch (error: unknown) {
      console.error('Error al cargar estadísticas:', (error as Error).message || error);
    }
  }, []);

  // Actualizar perfil
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    try {
      setState(prev => ({ ...prev, isUpdating: true, error: null }));
      const response = await UserService.updateProfile(data);

      // Recargar perfil después de actualizar
      await loadProfile();

      setState(prev => ({ ...prev, isUpdating: false }));
      return response;
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isUpdating: false,
        error: (error as Error).message || 'Error al actualizar perfil'
      }));
      throw error;
    }
  }, [loadProfile]);

  // Cambiar contraseña
  const changePassword = useCallback(async (data: ChangePasswordData) => {
    try {
      setState(prev => ({ ...prev, isChangingPassword: true, error: null }));
      const response = await UserService.changePassword(data);
      setState(prev => ({ ...prev, isChangingPassword: false }));
      return response;
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isChangingPassword: false,
        error: (error as Error).message || 'Error al cambiar contraseña'
      }));
      throw error;
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadProfile();
    loadStats();
  }, [loadProfile, loadStats]);

  return {
    ...state,
    loadProfile,
    loadStats,
    updateProfile,
    changePassword,
  };
}
