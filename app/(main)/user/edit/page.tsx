'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUser } from '@/hooks/useUser'
import { Loader2, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const UserEditPage = () => {
  const router = useRouter()
  const { profile, updateProfile, isUpdating, isLoading } = useUser()

  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Cargar datos del perfil cuando esté disponible
  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name,
        email: profile.email,
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.display_name.trim()) {
      setError('El nombre es obligatorio')
      return
    }

    try {
      await updateProfile({
        display_name: formData.display_name,
      })

      setSuccess('Perfil actualizado exitosamente')

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/user')
      }, 2000)
    } catch (error: unknown) {
      setError((error as Error).message || 'Error al actualizar perfil')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='flex items-center gap-2 text-white'>
          <Loader2 className='w-5 h-5 animate-spin' />
          <span>Cargando información...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='h-full overflow-y-auto custom-scrollbar'>
      <div className='p-3 md:p-6 space-y-4 md:space-y-6 pb-8'>
        <div className='space-y-1 md:space-y-2'>
          <h1 className='text-white text-xl md:text-2xl lg:text-3xl font-bold'>
            Editar Perfil
          </h1>
          <p className='text-slate-400 text-sm'>
            Actualiza tu información personal
          </p>
        </div>

        <form onSubmit={handleSubmit} className='px-4 space-y-6 max-w-lg'>
          {/* Nombre */}
          <div className='space-y-2'>
            <Label htmlFor='display_name' className='text-white'>
              Nombre Completo
            </Label>
            <Input
              id='display_name'
              type='text'
              value={formData.display_name}
              onChange={(e) =>
                handleInputChange('display_name', e.target.value)
              }
              placeholder='Ingresa tu nombre completo'
              className='h-10 w-full'
              disabled={isUpdating}
            />
          </div>

          {/* Email (solo lectura) */}
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-white'>
              Correo Electrónico
            </Label>
            <Input
              id='email'
              type='email'
              value={formData.email}
              className='h-10 w-full bg-gray-800 text-gray-400'
              disabled={true}
            />
            <p className='text-xs text-slate-500'>
              El correo electrónico no se puede cambiar
            </p>
          </div>

          {/* Mensajes de error y éxito */}
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className='border-green-500 text-green-400'>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Botones */}
          <div className='flex flex-col sm:flex-row gap-3 pt-4'>
            <Link href='/user'>
              <Button
                type='button'
                variant='ghost'
                className='w-full sm:w-auto'
                disabled={isUpdating}
              >
                <X className='w-4 h-4 mr-2' />
                Cancelar
              </Button>
            </Link>

            <Button
              type='submit'
              variant='primary'
              className='w-full sm:w-auto'
              disabled={isUpdating || !formData.display_name.trim()}
            >
              {isUpdating ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4 mr-2' />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserEditPage
