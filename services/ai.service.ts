import { AIQueryRequest, AIQueryResponse } from '@/types/chat.types'

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8010'

export class AIService {
  // Realizar consulta directa al motor de IA
  static async query(data: AIQueryRequest): Promise<{ data: AIQueryResponse }> {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/rag/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: data.question,
          k: data.k || 4,
          evaluate: data.evaluate ?? true
        }),
      })

      if (!response.ok) {
        throw new Error(`Error del servicio IA: ${response.status}`)
      }

      const aiData = await response.json()

      return {
        data: {
          ok: aiData.ok,
          answer: aiData.answer,
          sources: aiData.sources,
          latency_ms: aiData.latency_ms,
          eval: aiData.eval
        }
      }
    } catch (error) {
      console.error('Error calling AI service:', error)
      throw new Error('Error al consultar el motor de IA')
    }
  }

  // Verificar estado del servicio de IA
  static async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/health`)
      return await response.json()
    } catch (error) {
      throw new Error('Motor de IA no disponible')
    }
  }
}
