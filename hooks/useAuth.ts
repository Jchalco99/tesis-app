'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthService, User } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    error: null,
  });

  // Verificar estado de autenticación
  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await AuthService.getMe();

      setState(prev => ({
        ...prev,
        user: response.user || null,
        isAuthenticated: response.isAuthenticated,
        isLoading: false,
        isInitialized: true,
        error: null,
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null, // No mostrar error en verificación silenciosa
      }));
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await AuthService.login({ email, password });

      if (response.requiresVerification) {
        setState(prev => ({ ...prev, isLoading: false }));
        return { requiresVerification: true, email: response.email || email };
      }

      await checkAuth();
      return { requiresVerification: false };
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message || 'Error en el login'
      }));
      throw error;
    }
  }, [checkAuth]);

  // Registro
  const register = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await AuthService.register({
        email,
        password,
        display_name: displayName
      });

      setState(prev => ({ ...prev, isLoading: false }));

      if (response.requiresVerification) {
        return { requiresVerification: true };
      }

      await checkAuth();
      return { requiresVerification: false };
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message || 'Error en el registro'
      }));
      throw error;
    }
  }, [checkAuth]);

  // Verificar código
  const verify = useCallback(async (email: string, code: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await AuthService.verify({ email, code });
      await checkAuth();
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message || 'Código de verificación inválido'
      }));
      throw error;
    }
  }, [checkAuth]);

  // Logout
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await AuthService.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    } catch (error: unknown) {
      console.error('Error durante logout:', error);
      // Limpiar estado local aunque falle la petición
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    }
  }, []);

  // Reenviar código
  const resendCode = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await AuthService.resendVerificationCode(email);
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        error: (error as Error).message || 'Error al reenviar código'
      }));
      throw error;
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Cargar estado inicial
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...state,
    login,
    register,
    verify,
    logout,
    checkAuth,
    clearError,
    resendCode,
  };
}
