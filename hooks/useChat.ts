'use client';

import { ChatService } from '@/services/chat.service';
import {
    Conversation,
    ConversationWithDetails,
    CreateConversationData,
    Message,
} from '@/types/chat.types';
import { useCallback, useRef, useState } from 'react';

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

      // Crear mensaje del usuario inmediatamente en el estado local (optimistic UI)
      const tempUserMessage: Message = {
        id: `temp-user-${Date.now()}`,
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

      // Ejecutar la consulta a la IA en segundo plano (no esperar para devolver el conversationId)
      const conversationIdToReturn = targetConversationId;

      // Continuar con la petición en segundo plano
      (async () => {
        try {
          // Usar el endpoint /ask que maneja todo el flujo (usuario + IA)
          const response = await ChatService.askQuestion(
            targetConversationId!,
            content,
            { evaluate: true } // Siempre evaluar para métricas
          );

          // Remover el mensaje temporal del usuario y agregar los mensajes reales del servidor
          setState(prev => {
            // Filtrar mensajes temporales
            const withoutUserTemp = prev.messages.filter(msg => msg.id !== tempUserMessage.id);

            // Verificar que los mensajes reales no estén ya en el estado (evitar duplicados)
            const userExists = withoutUserTemp.some(m => m.id === response.data.user.id);
            const botExists = withoutUserTemp.some(m => m.id === response.data.bot.id);

            const newMessages = [
              ...(userExists ? [] : [response.data.user]),
              ...(botExists ? [] : [response.data.bot])
            ];

            return {
              ...prev,
              messages: [...withoutUserTemp, ...newMessages],
              isSending: false
            };
          });

        } catch (aiError) {
          console.error('Error en consulta IA:', aiError);

          setState(prev => ({
            ...prev,
            isSending: false
          }));

          // Mostrar mensaje de error
          const errorMessage: Message = {
            id: `error-${Date.now()}`,
            conversation_id: targetConversationId!,
            sender: 'system',
            content: 'Lo siento, hubo un problema al procesar tu pregunta. Por favor, intenta de nuevo.',
            created_at: new Date().toISOString(),
          };

          addMessageToState(errorMessage);
        }
      })();

      // Devolver el conversationId INMEDIATAMENTE para navegación rápida
      return conversationIdToReturn;
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        isSending: false,
        error: (error as Error).message || 'Error al enviar mensaje'
      }));
      throw error;
    }
  }, [createConversation, addMessageToState]);

  // Calificar mensaje
  const rateMessage = useCallback(async (messageId: string, rating: number, comment?: string) => {
    try {
      await ChatService.feedbackMessage(messageId, { rating, comment });

      // Actualizar el mensaje con la calificación en el estado local
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === messageId
            ? { ...msg, feedback: [{ id: Date.now(), message_id: messageId, user_id: '', rating, comment, created_at: new Date().toISOString() }] }
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

  // Eliminar conversación (eliminación lógica)
  const deleteConversation = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await ChatService.deleteConversation(id);

      // Actualizar estado inmediatamente (remover de la lista)
      setState(prev => ({
        ...prev,
        conversations: prev.conversations.filter(c => c.id !== id),
        // Si es la conversación actual, limpiarla
        currentConversation: prev.currentConversation?.id === id ? null : prev.currentConversation,
        messages: prev.currentConversation?.id === id ? [] : prev.messages
      }));

      // Actualizar ref si es la conversación actual
      if (currentConversationIdRef.current === id) {
        currentConversationIdRef.current = null;
      }

      return true;
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        error: (error as Error).message || 'Error al eliminar conversación'
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
    loadConversations,
    createConversation,
    loadConversation,
    sendMessage,
    rateMessage,
    deleteConversation,
    clearCurrentConversation,
    addMessageToState,
    addConversationToState,
  };
}
