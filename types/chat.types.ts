export type SenderType = 'user' | 'bot' | 'system'

export interface Conversation {
  id: string
  owner_user_id: string
  title?: string
  created_at: string
  closed_at?: string
  messages_count?: number
  participants_count?: number
}

export interface Participant {
  conversation_id: string
  user_id: string
  is_owner: boolean
  added_at: string
  user?: {
    id: string
    display_name: string
    avatar_url?: string
  }
}

export interface Message {
  id: string
  conversation_id: string
  sender_user_id?: string
  sender: SenderType
  content: string
  latency_ms?: number
  created_at: string
  user?: {
    display_name: string
    avatar_url?: string
  }
  // Nuevos campos para IA
  ai_sources?: AISource[]
  ai_eval?: AIEvaluation
}

export interface MessageFeedback {
  id: number
  message_id: string
  user_id: string
  rating: number // 1-5
  comment?: string
  created_at: string
}

export interface CreateConversationData {
  title?: string
}

export interface CreateMessageData {
  content: string
  sender: SenderType
}

export interface MessageFeedbackData {
  rating: number
  comment?: string
}

export interface ConversationWithDetails extends Conversation {
  participants: Participant[]
  recent_messages?: Message[]
}

// Nuevos tipos para IA
export interface AISource {
  source: string
  chunk: number
}

export interface AIEvaluation {
  context_similarity: number
  citation_coverage: number
  length_ok: number
  overall: number
}

export interface AIQueryRequest {
  question: string
  k?: number
  evaluate?: boolean
}

export interface AIQueryResponse {
  ok: boolean
  answer: string
  sources: AISource[]
  latency_ms: number
  eval?: AIEvaluation
}
