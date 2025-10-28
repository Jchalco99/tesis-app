/**
 * Cliente API principal para la aplicación
 * Configurado para trabajar con cookies de sesión del backend
 */

import { ApiResponse, ApiError } from '@/types/api.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

/**
 * Cliente API personalizado que maneja cookies de sesión
 */
export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * Método principal para realizar peticiones a la API
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      credentials: 'include', // Importante para las cookies de sesión
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      // Verificar si hay contenido para parsear
      const contentType = response.headers.get('content-type')

      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          throw new ApiError(
            `Error ${response.status}: ${response.statusText}`,
            response.status
          )
        }
        return {} as T // Retorna objeto vacío si no hay JSON
      }

      const text = await response.text()
      let data

      try {
        data = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError)
        throw new ApiError('Error parsing server response', response.status)
      }

      if (!response.ok) {
        throw new ApiError(
          data.message || data.error || 'Error en la petición',
          response.status,
          data
        )
      }

      return data as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      // Error de red o parsing
      throw new ApiError(
        'Error de conexión con el servidor',
        0,
        { originalError: error }
      )
    }
  }

  /**
   * Métodos HTTP convenientes
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options })
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options })
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient()

export default apiClient
