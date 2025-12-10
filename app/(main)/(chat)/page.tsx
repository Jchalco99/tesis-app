'use client'

import { Button } from '@/components/ui/button'
import { useChatContext } from '@/providers/ChatProvider'
import { Loader2, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import TypeWriter from 'typewriter-effect'
import ChatInput from './chat-input'

const ALL_EXAMPLE_QUERIES = [
  'Tesis sobre energías renovables en el Perú',
  'Tesis sobre inteligencia artificial aplicada',
  'Tesis sobre análisis de datos y Big Data',
  'Investigación sobre ciberseguridad',
  'Tesis sobre IoT y domótica',
  'Estudios sobre blockchain y criptomonedas',
  'Tesis sobre machine learning',
  'Investigación sobre redes neuronales',
  'Tesis sobre desarrollo web moderno',
  'Estudios sobre cloud computing',
  'Tesis sobre realidad virtual y aumentada',
  'Investigación sobre automatización industrial',
  'Tesis sobre sistemas embebidos',
  'Estudios sobre robótica educativa',
  'Tesis sobre desarrollo móvil',
  'Investigación sobre bases de datos NoSQL',
  'Tesis sobre computación en la nube',
  'Estudios sobre DevOps y CI/CD',
  'Tesis sobre arquitectura de software',
  'Investigación sobre microservicios',
]

// Función para obtener 3 queries aleatorias
function getRandomQueries(count: number = 3): string[] {
  const shuffled = [...ALL_EXAMPLE_QUERIES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingQuery, setLoadingQuery] = useState<string | null>(null)
  const { sendMessage } = useChatContext()
  const router = useRouter()

  // Generar queries aleatorias que se mantienen durante la vida del componente
  // pero cambian cada vez que se recarga la página
  const exampleQueries = useMemo(() => getRandomQueries(3), [])

  const handleExampleClick = async (query: string) => {
    try {
      setIsLoading(true)
      setLoadingQuery(query)
      const conversationId = await sendMessage(query)
      router.push(`/chat/${conversationId}`)
    } catch (error) {
      console.error('Error al enviar mensaje de ejemplo:', error)
    } finally {
      setIsLoading(false)
      setLoadingQuery(null)
    }
  }

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
            {exampleQueries.map((query, index) => (
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
                <span className='break-words leading-relaxed'>{query}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
