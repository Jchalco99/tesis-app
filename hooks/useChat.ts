'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatService } from '@/services/chat.service';
import { useAI } from '@/hooks/useAI';
import {
  Conversation,
  Message,
  CreateConversationData,
  CreateMessageData,
  ConversationWithDetails
} from '@/types/chat.types';

interface ChatState {
  conversations: Conversation[];
  currentConversation: ConversationWithDetails | null;
  messages: Message[];
  isLoading: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    currentConversation: null,
    messages: [],
    isLoading: false,
    isLoadingMessages: false,
    isSending: false,
    error: null,
  });

  // Hook de IA
  const { askQuestion: askAI, loading: aiLoading, error: aiError } = useAI();

  // Ref para mantener el ID de la conversación actual
  const currentConversationIdRef = useRef<string | null>(null);

  // Función para actualizar mensajes de manera reactiva
  const addMessageToState = useCallback((message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  }, []);

  // Función para actualizar conversaciones
  const addConversationToState = useCallback((conversation: Conversation) => {
    setState(prev => ({
      ...prev,
      conversations: [conversation, ...prev.conversations.filter(c => c.id !== conversation.id)]
    }));
  }, []);

  // Cargar todas las conversaciones
  const loadConversations = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await ChatService.getConversations();
      setState(prev => ({
        ...prev,
        conversations: response.data,
        isLoading: false
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message || 'Error al cargar conversaciones'
      }));
    }
  }, []);

  // Crear nueva conversación
  const createConversation = useCallback(async (data?: CreateConversationData) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const response = await ChatService.createConversation(data || {});

      // Actualizar estado inmediatamente
      addConversationToState(response.data);

      return response.data;
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        error: (error as Error).message || 'Error al crear conversación'
      }));
      throw error;
    }
  }, [addConversationToState]);

  // Cargar conversación específica y sus mensajes
  const loadConversation = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, isLoadingMessages: true, error: null }));
      currentConversationIdRef.current = id;

      const [conversationResponse, messagesResponse] = await Promise.all([
        ChatService.getConversation(id),
        ChatService.getMessages(id)
      ]);

      // Solo actualizar si seguimos en la misma conversación
      if (currentConversationIdRef.current === id) {
        setState(prev => ({
          ...prev,
          currentConversation: conversationResponse.data,
          messages: messagesResponse.data,
          isLoadingMessages: false
        }));
      }
    } catch (error: unknown) {
      if (currentConversationIdRef.current === id) {
        setState(prev => ({
          ...prev,
          isLoadingMessages: false,
          error: (error as Error).message || 'Error al cargar conversación'
        }));
      }
    }
  }, []);

  // Enviar mensaje con IA integrada
  const sendMessage = useCallback(async (content: string, conversationId?: string): Promise<string> => {
    try {
      setState(prev => ({ ...prev, isSending: true, error: null }));

      let targetConversationId = conversationId;

      // Si no hay conversación, crear una nueva
      if (!targetConversationId) {
        const newConversation = await createConversation({
          title: content.length > 50 ? content.substring(0, 50) + '...' : content
        });
        targetConversationId = newConversation.id;
        currentConversationIdRef.current = targetConversationId;
      }

      // Crear mensaje del usuario inmediatamente en el estado local
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: targetConversationId,
        sender: 'user',
        content,
        created_at: new Date().toISOString(),
        user: {
          display_name: 'Usuario',
          avatar_url: undefined
        }
      };

      // Agregar mensaje temporal al estado
      addMessageToState(tempUserMessage);

      // Enviar mensaje del usuario al servidor
      const userMessageData: CreateMessageData = {
        content,
        sender: 'user'
      };

      const userMessageResponse = await ChatService.sendMessage(
        targetConversationId,
        userMessageData
      );

      // Reemplazar mensaje temporal con el real
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === tempUserMessage.id ? userMessageResponse.data : msg
        )
      }));

      // Consultar a la IA directamente
      try {
        const aiResponse = await askAI(content);

        if (aiResponse && currentConversationIdRef.current === targetConversationId) {
          const botMessageData: CreateMessageData = {
            content: aiResponse.answer,
            sender: 'bot'
          };

          const botMessageResponse = await ChatService.sendMessage(
            targetConversationId,
            botMessageData
          );

          // Agregar información de IA al mensaje del bot
          const enhancedBotMessage: Message = {
            ...botMessageResponse.data,
            ai_sources: aiResponse.sources,
            ai_eval: aiResponse.eval,
            latency_ms: aiResponse.latency_ms
          };

          addMessageToState(enhancedBotMessage);
        }
      } catch (aiError) {
        console.error('Error en consulta IA:', aiError);

        // Fallback: respuesta de error amigable
        if (currentConversationIdRef.current === targetConversationId) {
          const errorBotMessage: CreateMessageData = {
            content: 'Lo siento, no pude procesar tu consulta en este momento. Asegúrate de que el motor de IA esté ejecutándose en el puerto 8010.',
            sender: 'bot'
          };

          const botMessageResponse = await ChatService.sendMessage(
            targetConversationId,
            errorBotMessage
          );

          addMessageToState(botMessageResponse.data);
        }
      }

      setState(prev => ({ ...prev, isSending: false }));
      return targetConversationId;
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isSending: false,
        error: (error as Error).message || 'Error al enviar mensaje'
      }));
      throw error;
    }
  }, [createConversation, addMessageToState, askAI]);

  // Calificar mensaje
  const rateMessage = useCallback(async (messageId: string, rating: number, comment?: string) => {
    try {
      await ChatService.feedbackMessage(messageId, { rating, comment });

      // Actualizar el mensaje con la calificación en el estado local
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === messageId
            ? { ...msg, feedback: { rating, comment } }
            : msg
        )
      }));
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        error: (error as Error).message || 'Error al calificar mensaje'
      }));
      throw error;
    }
  }, []);

  // Limpiar conversación actual
  const clearCurrentConversation = useCallback(() => {
    currentConversationIdRef.current = null;
    setState(prev => ({
      ...prev,
      currentConversation: null,
      messages: []
    }));
  }, []);

  return {
    ...state,
    isSending: state.isSending || aiLoading,
    error: state.error || aiError,
    loadConversations,
    createConversation,
    loadConversation,
    sendMessage,
    rateMessage,
    clearCurrentConversation,
    addMessageToState,
    addConversationToState,
  };
}
