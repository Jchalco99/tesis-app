import { User } from './auth.types'
import { Conversation, MessageFeedback } from './chat.types'

export interface AdminUser extends User {
  roles: string[]
}

export interface AuditEvent {
  id: number
  actor_user_id?: string
  action: string
  target_user_id?: string
  payload: Record<string, unknown>
  created_at: string
  actor_user?: {
    display_name: string
    email: string
  }
  target_user?: {
    display_name: string
    email: string
  }
}

export interface UserStats {
  total_users: number
  active_users: number
  admin_users: number
  new_users_this_month: number
}

export interface ConversationSummary extends Conversation {
  messages_count: number
  participants_count: number
}

export interface FeedbackStats {
  user_id: string
  display_name: string
  email: string
  total_ratings: number
  avg_rating: number
}

export interface AdminFilters {
  q?: string
  status?: 'active' | 'inactive'
  role?: string
  page?: number
  limit?: number
}

export interface ChatAnalytics {
  total_conversations: number
  total_messages: number
  avg_messages_per_conversation: number
  avg_rating: number
  most_active_users: Array<{
    user_id: string
    display_name: string
    message_count: number
  }>
}
