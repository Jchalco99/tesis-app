"use client";

import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import TypeWriter from 'typewriter-effect'
import { Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { FaGoogle } from 'react-icons/fa'

const LoginPage = () => {
  return (
    <div className='flex items-center justify-center flex-1 px-4 py-5 sm:px-10 md:px-20 lg:px-40'>
      <div className='w-full max-w-[512px] flex flex-col gap-6'>
        <h2 className='text-white text-[28px] font-bold text-center'>
          <TypeWriter
            options={{
              strings: ['TECSUP', 'Iniciar sesión', 'Bienvenido de nuevo'],
              autoStart: true,
              loop: true,
              delay: 200,
              deleteSpeed: 100,
            }}
          />
        </h2>
        <div className='flex flex-col gap-3'>
          <InputGroup className='h-12 pl-2'>
            <InputGroupInput type='email' placeholder="Email" />
            <InputGroupAddon align="inline-end">
              <Mail />
            </InputGroupAddon>
          </InputGroup>

          <InputGroup className='h-12 pl-2'>
            <InputGroupInput type='password' placeholder="Contraseña" />
            <InputGroupAddon align="inline-end">
              <Lock />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className='flex flex-col gap-3'>
          <Link href='/'>
            <Button variant='primary' className='w-full h-10 rounded-full'>
              Iniciar sesión
            </Button>
          </Link>
          <Link href='/register'>
            <Button
              variant='primaryOutline'
              className='w-full h-10 rounded-full'
            >
              Registrarse
            </Button>
          </Link>
        </div>
        <div className='flex items-center justify-center'>
          <p className='mb-3 text-sm text-gray-400'>o</p>
        </div>
        <div className='text-center'>
          <Button variant='ghost' className='w-full h-10 gap-2 rounded-full'>
            <FaGoogle className='w-4 h-4 text-white' />
            Iniciar sesión con Google
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
