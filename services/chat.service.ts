import { apiClient } from '@/lib/api';
import {
  Conversation,
  Message,
  CreateConversationData,
  CreateMessageData,
  MessageFeedbackData,
  ConversationWithDetails
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
    return apiClient.get<{ data: Message[] }>(
      `${this.BASE_URL}/conversations/${conversationId}/messages`
    );
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
}
