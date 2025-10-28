'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { Send, Loader2 } from 'lucide-react';
import { useChatContext } from '@/providers/ChatProvider';

interface ChatInputProps {
  conversationId?: string;
  onMessageSent?: (conversationId: string) => void;
}

const ChatInput = ({ conversationId, onMessageSent }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const { sendMessage, isSending } = useChatContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isSending) return;

    const messageToSend = message;
    setMessage(''); // Limpiar input inmediatamente para mejor UX

    try {
      const resultConversationId = await sendMessage(messageToSend, conversationId);

      if (onMessageSent) {
        onMessageSent(resultConversationId);
      } else if (!conversationId) {
        // Si estamos en la página principal y no hay conversación, navegar a la nueva
        router.push(`/chat/${resultConversationId}`);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      // Restaurar mensaje en caso de error
      setMessage(messageToSend);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className='w-full max-w-[600px]'>
      <form onSubmit={handleSubmit} className='flex items-center gap-2 px-3 py-2 rounded-full bg-slate-700'>
        <InputGroup className='pl-4 rounded-full [&:has([data-slot=input-group-control]:focus-visible)]:border-transparent [&:has([data-slot=input-group-control]:focus-visible)]:ring-0'>
          <InputGroupTextarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Escribe tu mensaje'
            className='min-h-[2.25rem] max-h-[7.5rem] py-2 resize-none overflow-y-auto focus-visible:ring-0 focus-visible:border-transparent
              scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-500
              hover:scrollbar-thumb-slate-400 scrollbar-thumb-rounded-full
              [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-slate-400'
            rows={1}
            disabled={isSending}
          />
          <InputGroupAddon align='inline-end'>
            <Button
              type="submit"
              variant='primary'
              size='sm'
              className='p-2 rounded-full'
              disabled={!message.trim() || isSending}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
};

export default ChatInput;
