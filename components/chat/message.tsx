'use client';

import { useState } from 'react';
import { Message } from '@/types/chat.types';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Star, MessageSquare } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface MessageComponentProps {
  message: Message;
}

export default function MessageComponent({ message }: MessageComponentProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const { rateMessage } = useChat();

  const isBot = message.sender === 'bot';
  const isUser = message.sender === 'user';

  const handleRating = async (newRating: number) => {
    try {
      await rateMessage(message.id, newRating, comment);
      setRating(newRating);
      setShowFeedback(false);
    } catch (error) {
      console.error('Error al enviar calificación:', error);
    }
  };

  return (
    <div className={`flex items-end gap-3 ${isUser ? 'justify-end' : ''}`}>
      {/* Avatar del bot (izquierda) */}
      {isBot && (
        <div
          className='bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 sm:w-10 flex-shrink-0'
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAslSrExRAzL0hUUzsPH7MawQMsxNP0TlLrKL3xGZwN7cTBP6Lo_Qi3MczViwFHYPc9guuZ1XT9Km9EqoksMsRXIcnKsRuR0SD0q441IDylApvpf1co9uRnMT-Q9cQFS663ruJswoJlYG8dkm_KL5FVGOi7PY3iRNFbDN-6ixrEyQG1LLnfh9Mk2eCN_iWrjUrmXdzxj1B8sw1QZrIWb2wAiLVEK27tZbm-NoctU6EHGQpEIRNbXCZcGMT7QX-6zHDoQj8ZLDZbRWU")',
          }}
        />
      )}

      <div className={`flex flex-1 flex-col gap-1 ${isUser ? 'items-end' : ''}`}>
        <p className='text-slate-400 text-xs sm:text-sm'>
          {isBot ? 'TesisAI' : message.user?.display_name || 'Usuario'}
        </p>

        <div className={`
          text-sm sm:text-base max-w-full sm:max-w-[400px] lg:max-w-[500px]
          rounded-lg px-3 sm:px-4 py-2 sm:py-3
          ${isBot ? 'bg-slate-700 text-white' : 'bg-blue-500 text-white'}
        `}>
          <p className="whitespace-pre-wrap">{message.content}</p>

          {/* Botón de feedback para mensajes del bot */}
          {isBot && (
            <div className="mt-2 pt-2 border-t border-slate-600">
              {!showFeedback && !rating && (
                <Button
                  onClick={() => setShowFeedback(true)}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-300 hover:text-white p-1 h-auto"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Calificar respuesta
                </Button>
              )}

              {showFeedback && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        onClick={() => handleRating(star)}
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= (rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Comentario opcional..."
                    className="w-full text-xs bg-slate-600 text-white rounded p-2 resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRating(rating || 5)}
                      size="sm"
                      className="text-xs"
                    >
                      Enviar
                    </Button>
                    <Button
                      onClick={() => setShowFeedback(false)}
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {rating && (
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>Calificado con {rating} estrellas</span>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500">
          {new Date(message.created_at).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* Avatar del usuario (derecha) */}
      {isUser && (
        <div
          className='bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 sm:w-10 flex-shrink-0'
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQawndfYx92ha-EV2fSF7WFfl-QXgKijpm7mSRAIEq-yRm8EZiBb8zGPyvK6Xhi0riI_gkTKbersWh4KdMA4nJArloG2sqPiyW58pFj0KmriY30lL5GXXNheblwxVM04Ja5Y2QfnqNr3z9kWCwYFomfhcy3j9756PRTZkI_LMcoxd3v6lOF64za9iVqHLakTf-Xj1kv3YsM6_pl9ZExvjAh4pz7p-dM2FULTzpXtm3WkBiFqyFG1FkJPraeLTyd-3w8fj41EeMDg4")',
          }}
        />
      )}
    </div>
  );
}
