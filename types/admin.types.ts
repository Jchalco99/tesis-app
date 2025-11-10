import { User } from './auth.types'
import { Conversation } from './chat.types'

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

// Analytics types from backend
export interface ConversationAnalytics {
  conversation_id: string
  owner_user_id: string
  owner_display_name: string
  owner_email: string
  title: string
  created_at: string
  closed_at: string | null
  is_active: boolean
  total_messages: number
  total_participants: number
  avg_rating: number | null
  total_ratings: number
}

export interface ConversationParticipant {
  user_id: string
  is_owner: boolean
  added_at: string
  display_name: string
  email: string
}

export interface ConversationMessage {
  id: string
  sender: 'user' | 'assistant'
  sender_user_id: string | null
  sender_display_name: string | null
  sender_email: string | null
  content: string
  latency_ms: number | null
  created_at: string
  metadata: Record<string, unknown> | null
  feedback: Array<{
    id: string
    user_id: string
    user_display_name: string
    user_email: string
    rating: number
    comment: string | null
    created_at: string
  }>
}

export interface ConversationDetail {
  id: string
  owner_user_id: string
  title: string
  created_at: string
  closed_at: string | null
  is_active: boolean
  participants: ConversationParticipant[]
  messages: ConversationMessage[]
}

export interface FeedbackSummary {
  user_id: string
  display_name: string
  email: string
  total_ratings: number
  avg_rating: number
  rating_1_count: number
  rating_2_count: number
  rating_3_count: number
  rating_4_count: number
  rating_5_count: number
}

export interface FeedbackMessage {
  id: string
  message_id: string
  user_id: string
  user_display_name: string
  user_email: string
  rating: number
  comment: string | null
  created_at: string
  conversation_id: string
  sender: 'user' | 'assistant'
  message_created_at: string
  metadata: Record<string, unknown> | null
  sender_display_name: string | null
  sender_email: string | null
}

// Admin Users Management
export interface AdminUserListItem {
  id: string
  email: string
  display_name: string
  is_active: boolean
  created_at: string
  roles: string
}

export interface AdminUserListResponse {
  ok: boolean
  page: number
  limit: number
  total: number
  data: AdminUserListItem[]
}

export interface AdminUserFilters {
  q?: string
  page?: number
  limit?: number
  role?: 'admin' | 'user'
  status?: 'active' | 'inactive'
}
