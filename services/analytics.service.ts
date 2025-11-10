import { apiClient } from '@/lib/api'
import type {
    ConversationAnalytics,
    ConversationDetail,
    FeedbackMessage,
    FeedbackSummary,
} from '@/types/admin.types'
import type { PaginatedResponse } from '@/types/api.types'

export const AnalyticsService = {
  /**
   * Obtener resumen paginado de conversaciones con stats
   * Usa la ruta existente del backend: /api/admin/chat/conversations
   */
  async getConversations(params: {
    page?: number
    limit?: number
    q?: string
    owner?: string
    participant?: string
  }): Promise<PaginatedResponse<ConversationAnalytics>> {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.q) queryParams.append('q', params.q)
    if (params.owner) queryParams.append('owner', params.owner)
    if (params.participant) queryParams.append('participant', params.participant)

    return await apiClient.get<PaginatedResponse<ConversationAnalytics>>(
      `/api/admin/chat/conversations?${queryParams.toString()}`
    )
  },

  /**
   * Obtener detalle completo de una conversación
   * Usa la ruta existente del backend: /api/admin/chat/conversations/:id
   */
  async getConversationDetail(conversationId: string): Promise<{
    ok: boolean
    data: ConversationDetail
  }> {
    return await apiClient.get<{ ok: boolean; data: ConversationDetail }>(
      `/api/admin/chat/conversations/${conversationId}`
    )
  },

  /**
   * Obtener resumen de feedback por usuario (top users con stats)
   * Usa la ruta existente del backend: /api/admin/chat/feedback/summary
   */
  async getFeedbackSummary(): Promise<{
    ok: boolean
    data: FeedbackSummary[]
  }> {
    return await apiClient.get<{ ok: boolean; data: FeedbackSummary[] }>(
      '/api/admin/chat/feedback/summary'
    )
  },

  /**
   * Obtener actividad reciente con ratings y feedback
   * Usa la ruta existente del backend: /api/admin/chat/feedback/messages
   */
  async getFeedbackMessages(params: {
    page?: number
    limit?: number
    conversation?: string
    user?: string
  }): Promise<PaginatedResponse<FeedbackMessage>> {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.conversation) queryParams.append('conversation', params.conversation)
    if (params.user) queryParams.append('user', params.user)

    return await apiClient.get<PaginatedResponse<FeedbackMessage>>(
      `/api/admin/chat/feedback/messages?${queryParams.toString()}`
    )
  },
}
