'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useChat } from '@/hooks/useChat';
import { Conversation, Message, CreateConversationData, ConversationWithDetails } from '@/types/chat.types';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: ConversationWithDetails | null;
  messages: Message[];
  isLoading: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;
  loadConversations: () => Promise<void>;
  createConversation: (data?: CreateConversationData) => Promise<Conversation>;
  loadConversation: (id: string) => Promise<void>;
  sendMessage: (content: string, conversationId?: string) => Promise<string>;
  rateMessage: (messageId: string, rating: number, comment?: string) => Promise<void>;
  clearCurrentConversation: () => void;
  addMessageToState: (message: Message) => void;
  addConversationToState: (conversation: Conversation) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useChat();

  return (
    <ChatContext.Provider value={chat}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext debe ser usado dentro de ChatProvider');
  }
  return context;
}
