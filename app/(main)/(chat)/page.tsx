"use client"

import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import TypeWriter from 'typewriter-effect'
import ChatInput from './chat-input'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-full px-4 py-8'>
      <div className='w-full max-w-4xl flex flex-col items-center gap-8'>
        <h1 className='text-white text-3xl md:text-5xl font-bold text-center'>
          <TypeWriter
            options={{
              strings: ['TECSUP'],
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
            <Button
              variant='ghostOutline'
              className='flex items-start justify-start text-left h-auto min-h-[3rem] py-3 px-4 whitespace-normal'
            >
              <Search className='w-4 h-4 mr-3 flex-shrink-0 mt-0.5' />
              <span className='break-words leading-relaxed'>
                Tesis sobre energías renovables
              </span>
            </Button>
            <Link href='/id'>
              <Button
                variant='ghostOutline'
                className='flex items-start justify-start text-left h-auto min-h-[3rem] py-3 px-4 whitespace-normal'
              >
                <Search className='w-4 h-4 mr-3 flex-shrink-0 mt-0.5' />
                <span className='break-words leading-relaxed'>
                  Tesis sobre inteligencia artificial
                </span>
              </Button>
            </Link>
            <Button
              variant='ghostOutline'
              className='flex items-start justify-start text-left h-auto min-h-[3rem] py-3 px-4 whitespace-normal md:col-span-2 lg:col-span-1'
            >
              <Search className='w-4 h-4 mr-3 flex-shrink-0 mt-0.5' />
              <span className='break-words leading-relaxed'>
                Tesis sobre análisis de datos
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
