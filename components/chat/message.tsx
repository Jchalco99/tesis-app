'use client';

import { useState } from 'react';
import { Message } from '@/types/chat.types';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, FileText, Clock, BarChart3 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface MessageComponentProps {
  message: Message;
}

export default function MessageComponent({ message }: MessageComponentProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const { rateMessage } = useChat();

  const isBot = message.sender === 'bot';
  const isUser = message.sender === 'user';
  const hasAISources = isBot && message.ai_sources && message.ai_sources.length > 0;
  const hasAIEval = isBot && message.ai_eval;

  const handleRating = async (newRating: number) => {
    try {
      await rateMessage(message.id, newRating, comment);
      setRating(newRating);
      setShowFeedback(false);
    } catch (error) {
      console.error('Error al enviar calificación:', error);
    }
  };

  const formatLatency = (latency?: number) => {
    if (!latency) return '';
    return latency < 1000 ? `${latency}ms` : `${(latency / 1000).toFixed(1)}s`;
  };

  const getEvalColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
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

          {/* Información de IA para mensajes del bot */}
          {isBot && (hasAISources || hasAIEval || message.latency_ms) && (
            <div className="mt-3 pt-3 border-t border-slate-600">
              {/* Fuentes consultadas */}
              {hasAISources && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    📚 Fuentes consultadas:
                  </p>
                  <div className="space-y-1">
                    {message.ai_sources!.map((source, index) => (
                      <div key={index} className="flex items-center text-xs text-slate-400 bg-slate-600 rounded px-2 py-1">
                        <FileText className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {source.source} <span className="text-slate-500">(fragmento #{source.chunk})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Información de rendimiento y métricas */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                {message.latency_ms && (
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Respuesta en {formatLatency(message.latency_ms)}</span>
                  </div>
                )}

                {hasAIEval && (
                  <Button
                    onClick={() => setShowDetails(!showDetails)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-slate-400 hover:text-white p-1 h-auto"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {showDetails ? 'Ocultar' : 'Ver'} métricas
                  </Button>
                )}
              </div>

              {/* Métricas de evaluación IA */}
              {showDetails && hasAIEval && (
                <div className="bg-slate-600 rounded p-2 mb-3">
                  <p className="text-xs font-semibold text-slate-300 mb-2">Métricas de calidad:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Similitud contexto:</span>
                      <span className={`ml-1 font-medium ${getEvalColor(message.ai_eval.context_similarity)}`}>
                        {(message.ai_eval.context_similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Cobertura citas:</span>
                      <span className={`ml-1 font-medium ${getEvalColor(message.ai_eval.citation_coverage)}`}>
                        {(message.ai_eval.citation_coverage * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Longitud:</span>
                      <span className={`ml-1 font-medium ${getEvalColor(message.ai_eval.length_ok)}`}>
                        {(message.ai_eval.length_ok * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Puntuación total:</span>
                      <span className={`ml-1 font-medium ${getEvalColor(message.ai_eval.overall)}`}>
                        {(message.ai_eval.overall * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sección de feedback (tu código original) */}
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

          {/* Botón de feedback para mensajes del bot SIN información de IA */}
          {isBot && !hasAISources && !hasAIEval && !message.latency_ms && (
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
