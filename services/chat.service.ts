import { apiClient } from '@/lib/api';
import {
  Conversation,
  ConversationWithDetails,
  CreateConversationData,
  CreateMessageData,
  Message,
  MessageFeedbackData
} from '@/types/chat.types';

export class ChatService {
  private static readonly BASE_URL = '/api/chat';

  // Obtener todas las conversaciones del usuario
  static async getConversations(): Promise<{ data: Conversation[] }> {
    return apiClient.get<{ data: Conversation[] }>(`${this.BASE_URL}/conversations`);
  }

  // Crear nueva conversación
  static async createConversation(data: CreateConversationData): Promise<{ data: Conversation }> {
    return apiClient.post<{ data: Conversation }>(
      `${this.BASE_URL}/conversations`,
      data
    );
  }

  // Obtener detalles de una conversación específica
  static async getConversation(id: string): Promise<{ data: ConversationWithDetails }> {
    return apiClient.get<{ data: ConversationWithDetails }>(
      `${this.BASE_URL}/conversations/${id}`
    );
  }

  // Obtener mensajes de una conversación
  static async getMessages(conversationId: string): Promise<{ data: Message[] }> {
    const response = await apiClient.get<{ data: Message[] }>(
      `${this.BASE_URL}/conversations/${conversationId}/messages`
    );

    // Procesar metadata para extraer ai_sources y ai_eval
    const processedMessages = response.data.map(msg => {
      const aiSources = msg.metadata?.rag?.response?.sources || [];
      const aiEval = msg.metadata?.rag?.response?.evaluation;

      return {
        ...msg,
        ai_sources: aiSources,
        ai_eval: aiEval
      };
    });

    return { data: processedMessages };
  }

  // Enviar mensaje a una conversación
  static async sendMessage(
    conversationId: string,
    data: CreateMessageData
  ): Promise<{ data: Message }> {
    return apiClient.post<{ data: Message }>(
      `${this.BASE_URL}/conversations/${conversationId}/messages`,
      data
    );
  }

  // Calificar un mensaje
  static async feedbackMessage(
    messageId: string,
    data: MessageFeedbackData
  ): Promise<{ ok: boolean }> {
    return apiClient.post<{ ok: boolean }>(
      `${this.BASE_URL}/messages/${messageId}/feedback`,
      data
    );
  }

  // Hacer una pregunta a la IA (integrado con RAG)
  static async askQuestion(
    conversationId: string,
    question: string,
    options?: { k?: number; evaluate?: boolean }
  ): Promise<{ data: { user: Message; bot: Message } }> {
    const response = await apiClient.post<{ data: { user: Message; bot: Message } }>(
      `${this.BASE_URL}/conversations/${conversationId}/ask`,
      {
        question,
        k: options?.k,
        evaluate: options?.evaluate
      }
    );

    // Procesar metadata de ambos mensajes
    const processMessage = (msg: Message) => {
      const aiSources = msg.metadata?.rag?.response?.sources || [];
      const aiEval = msg.metadata?.rag?.response?.evaluation;

      return {
        ...msg,
        ai_sources: aiSources,
        ai_eval: aiEval
      };
    };

    return {
      data: {
        user: processMessage(response.data.user),
        bot: processMessage(response.data.bot)
      }
    };
  }

  // Eliminar conversación (soft delete)
  static async deleteConversation(id: string): Promise<{ data: Conversation }> {
    return apiClient.delete<{ data: Conversation }>(
      `${this.BASE_URL}/conversations/${id}`
    );
  }
}
