import { AnalyticsService } from '@/services/analytics.service'
import type {
    ConversationAnalytics,
    ConversationDetail,
    FeedbackMessage,
    FeedbackSummary,
} from '@/types/admin.types'
import { useCallback, useState } from 'react'

export const useAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [conversations, setConversations] = useState<ConversationAnalytics[]>([])
  const [conversationsTotal, setConversationsTotal] = useState(0)
  const [conversationDetail, setConversationDetail] =
    useState<ConversationDetail | null>(null)

  const [feedbackSummary, setFeedbackSummary] = useState<FeedbackSummary[]>([])
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([])
  const [feedbackMessagesTotal, setFeedbackMessagesTotal] = useState(0)

  /**
   * Cargar conversaciones con filtros
   */
  const loadConversations = useCallback(
    async (params: {
      page?: number
      limit?: number
      q?: string
      owner?: string
      participant?: string
    } = {}) => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await AnalyticsService.getConversations(params)
        setConversations(response.data)
        setConversationsTotal(response.total)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar conversaciones'
        )
        console.error('Error loading conversations:', err)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  /**
   * Cargar detalle de conversación
   */
  const loadConversationDetail = useCallback(
    async (conversationId: string) => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await AnalyticsService.getConversationDetail(
          conversationId
        )
        setConversationDetail(response.data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar detalle de conversación'
        )
        console.error('Error loading conversation detail:', err)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  /**
   * Cargar resumen de feedback
   */
  const loadFeedbackSummary = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await AnalyticsService.getFeedbackSummary()
      setFeedbackSummary(response.data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar resumen de feedback'
      )
      console.error('Error loading feedback summary:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Cargar mensajes con feedback
   */
  const loadFeedbackMessages = useCallback(
    async (params: {
      page?: number
      limit?: number
      conversation?: string
      user?: string
    } = {}) => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await AnalyticsService.getFeedbackMessages(params)
        setFeedbackMessages(response.data)
        setFeedbackMessagesTotal(response.total)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar mensajes con feedback'
        )
        console.error('Error loading feedback messages:', err)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    isLoading,
    error,
    conversations,
    conversationsTotal,
    conversationDetail,
    feedbackSummary,
    feedbackMessages,
    feedbackMessagesTotal,
    loadConversations,
    loadConversationDetail,
    loadFeedbackSummary,
    loadFeedbackMessages,
  }
}
