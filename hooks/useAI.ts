'use client'

import { useState, useCallback } from 'react'
import { AIService } from '@/services/ai.service'
import { AIQueryRequest, AIQueryResponse } from '@/types/chat.types'

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const askQuestion = useCallback(async (question: string, options?: Partial<AIQueryRequest>): Promise<AIQueryResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const queryData: AIQueryRequest = {
        question,
        k: options?.k || 4,
        evaluate: options?.evaluate ?? true
      }

      const result = await AIService.query(queryData)
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en IA'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const checkHealth = useCallback(async () => {
    try {
      const result = await AIService.checkHealth()
      return result.status === 'ok'
    } catch {
      return false
    }
  }, [])

  return {
    askQuestion,
    checkHealth,
    loading,
    error
  }
}
