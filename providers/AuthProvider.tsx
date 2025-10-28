'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, MeResponse, AuthResponse } from '@/types/auth.types'
import { apiClient } from '@/lib/api'
import { API_ENDPOINTS } from '@/lib/constants'

interface AuthContextType {
  // Estado
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean

  // Acciones
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (email: string, password: string, displayName: string) => Promise<AuthResponse>
  verify: (email: string, code: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  setPassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Inicializar el estado de autenticación al cargar la app
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<MeResponse>(API_ENDPOINTS.AUTH.ME)

      if (response.isAuthenticated && response.user) {
        setUser(response.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error verificando estado de autenticación:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        { email, password }
      )

      // Si no requiere verificación, el usuario ya está logueado
      if (!response.requiresVerification && response.user) {
        setUser(response.user)
      }

      return response
    } catch (error: unknown) {
      throw error
    }
  }

  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        {
          email,
          password,
          display_name: displayName
        }
      )

      // Si el registro es exitoso y no requiere verificación, el usuario ya está logueado
      if (response.ok && !response.requiresVerification && response.user) {
        setUser(response.user)
      }

      return response
    } catch (error: unknown) {
      throw error
    }
  }

  const verify = async (email: string, code: string): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.VERIFY, { email, code })

      // Después de la verificación exitosa, refrescar el estado del usuario
      await refreshUser()
    } catch (error: unknown) {
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error('Error durante logout:', error)
    } finally {
      setUser(null)
    }
  }

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiClient.get<MeResponse>(API_ENDPOINTS.AUTH.ME)

      if (response.isAuthenticated && response.user) {
        setUser(response.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error refrescando usuario:', error)
      setUser(null)
    }
  }

  const setPassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.SET_PASSWORD, {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      })
    } catch (error: unknown) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    verify,
    logout,
    refreshUser,
    setPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
