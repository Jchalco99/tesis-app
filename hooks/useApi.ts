'use client'

import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api'
import { ApiError } from '@/types/api.types'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: ApiError) => void
}

export function useApi<T = unknown>(options?: UseApiOptions) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async <R = T>(
    apiCall: () => Promise<R>
  ): Promise<R | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const result = await apiCall()
      setState({ data: result as unknown as T, loading: false, error: null })

      if (options?.onSuccess) {
        options.onSuccess(result)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Error inesperado'

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))

      if (options?.onError && error instanceof ApiError) {
        options.onError(error)
      }

      return null
    }
  }, [options])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

// Hook específico para operaciones GET
export function useApiGet<T = unknown>(endpoint: string, options?: UseApiOptions) {
  const { execute, ...rest } = useApi<T>(options)

  const get = useCallback(() => {
    return execute(() => apiClient.get<T>(endpoint))
  }, [execute, endpoint])

  return {
    ...rest,
    get,
  }
}

// Hook específico para operaciones POST
export function useApiPost<T = unknown>(endpoint: string, options?: UseApiOptions) {
  const { execute, ...rest } = useApi<T>(options)

  const post = useCallback((data?: unknown) => {
    return execute(() => apiClient.post<T>(endpoint, data))
  }, [execute, endpoint])

  return {
    ...rest,
    post,
  }
}

// Hook específico para operaciones PUT
export function useApiPut<T = unknown>(endpoint: string, options?: UseApiOptions) {
  const { execute, ...rest } = useApi<T>(options)

  const put = useCallback((data?: unknown) => {
    return execute(() => apiClient.put<T>(endpoint, data))
  }, [execute, endpoint])

  return {
    ...rest,
    put,
  }
}

// Hook específico para operaciones DELETE
export function useApiDelete<T = unknown>(endpoint: string, options?: UseApiOptions) {
  const { execute, ...rest } = useApi<T>(options)

  const del = useCallback(() => {
    return execute(() => apiClient.delete<T>(endpoint))
  }, [execute, endpoint])

  return {
    ...rest,
    delete: del,
  }
}
