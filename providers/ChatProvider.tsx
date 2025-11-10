'use client'

import { useChat } from '@/hooks/useChat'
import {
  Conversation,
  ConversationWithDetails,
  CreateConversationData,
  Message,
} from '@/types/chat.types'
import { createContext, ReactNode, useContext } from 'react'

interface ChatContextType {
  conversations: Conversation[]
  currentConversation: ConversationWithDetails | null
  messages: Message[]
  isLoading: boolean
  isLoadingMessages: boolean
  isSending: boolean
  error: string | null
  loadConversations: () => Promise<void>
  createConversation: (data?: CreateConversationData) => Promise<Conversation>
  loadConversation: (id: string) => Promise<void>
  sendMessage: (content: string, conversationId?: string) => Promise<string>
  rateMessage: (
    messageId: string,
    rating: number,
    comment?: string
  ) => Promise<void>
  deleteConversation: (id: string) => Promise<boolean>
  clearCurrentConversation: () => void
  addMessageToState: (message: Message) => void
  addConversationToState: (conversation: Conversation) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useChat()

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext debe ser usado dentro de ChatProvider')
  }
  return context
}
