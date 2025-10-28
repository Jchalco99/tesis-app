'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import TypeWriter from 'typewriter-effect';
import ChatInput from './chat-input';
import { useChatContext } from '@/providers/ChatProvider';

const EXAMPLE_QUERIES = [
  'Tesis sobre energías renovables',
  'Tesis sobre inteligencia artificial',
  'Tesis sobre análisis de datos'
];

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState<string | null>(null);
  const { sendMessage } = useChatContext(); // Usar el contexto correcto
  const router = useRouter();

  const handleExampleClick = async (query: string) => {
    try {
      setIsLoading(true);
      setLoadingQuery(query);
      const conversationId = await sendMessage(query);
      router.push(`/chat/${conversationId}`);
    } catch (error) {
      console.error('Error al enviar mensaje de ejemplo:', error);
    } finally {
      setIsLoading(false);
      setLoadingQuery(null);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-full px-4 py-8'>
      <div className='w-full max-w-4xl flex flex-col items-center gap-8'>
        <h1 className='text-white text-3xl md:text-5xl font-bold text-center'>
          <TypeWriter
            options={{
              strings: ['TesisAI', 'TECSUP'],
              autoStart: true,
              loop: true,
              delay: 200,
              deleteSpeed: 100,
            }}
          />
        </h1>

        <ChatInput />

        <div className='w-full max-w-3xl'>
          <h2 className='text-white text-lg md:text-xl font-bold mb-4 text-left'>
            Ejemplos:
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {EXAMPLE_QUERIES.map((query, index) => (
              <Button
                key={index}
                onClick={() => handleExampleClick(query)}
                disabled={isLoading}
                variant='ghostOutline'
                className='flex items-start justify-start text-left h-auto min-h-[3rem] py-3 px-4 whitespace-normal hover:bg-slate-700/50 transition-colors disabled:opacity-50'
              >
                {isLoading && loadingQuery === query ? (
                  <Loader2 className='w-4 h-4 mr-3 flex-shrink-0 mt-0.5 animate-spin' />
                ) : (
                  <Search className='w-4 h-4 mr-3 flex-shrink-0 mt-0.5' />
                )}
                <span className='break-words leading-relaxed'>
                  {query}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
