import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers/Providers'

const font = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TECSUP - Tesis App',
  description: 'Aplicación de tesis con sistema de chat y autenticación',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='es'>
      <body className={font.className}>
        <Providers>
          <div className='flex min-h-screen flex-col bg-[#121516] overflow-x-hidden'>
            <main className='flex flex-col flex-1'>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
