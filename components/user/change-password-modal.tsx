'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserService } from '@/services/user.service';
import { Eye, EyeOff, Loader2, Key } from 'lucide-react';

export default function ChangePasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordInfo, setPasswordInfo] = useState<{
    canSet: boolean;
    hasPassword: boolean;
  } | null>(null);

  // Verificar estado de la contraseña cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadPasswordInfo();
    }
  }, [isOpen]);

  const loadPasswordInfo = async () => {
    try {
      const response = await UserService.canSetPassword();
      setPasswordInfo(response);
    } catch (error) {
      console.error('Error al verificar estado de contraseña:', error);
      setPasswordInfo({ canSet: true, hasPassword: true }); // Asumir que puede cambiar
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.new_password || !formData.confirm_password) {
      setError('La nueva contraseña y confirmación son obligatorias');
      return;
    }

    if (passwordInfo?.hasPassword && !formData.current_password) {
      setError('La contraseña actual es obligatoria');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (formData.new_password.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setIsLoading(true);

      const requestData = {
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
        ...(passwordInfo?.hasPassword && { current_password: formData.current_password }),
      };

      const response = await UserService.changePassword(requestData);

      setSuccess('Contraseña cambiada exitosamente');
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setIsOpen(false);
        setSuccess('');
      }, 2000);
    } catch (error: unknown) {
      setError((error as Error).message || 'Error al cambiar contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getModalTitle = () => {
    if (!passwordInfo) return 'Cambiar Contraseña';
    return passwordInfo.hasPassword ? 'Cambiar Contraseña' : 'Establecer Contraseña';
  };

  const getModalDescription = () => {
    if (!passwordInfo) return 'Cargando...';
    return passwordInfo.hasPassword
      ? 'Ingresa tu contraseña actual y la nueva contraseña.'
      : 'Como iniciaste sesión con Google, puedes establecer una contraseña para tu cuenta.';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full sm:w-auto">
          <Key className="w-4 h-4 mr-2" />
          {passwordInfo?.hasPassword === false ? 'Establecer Contraseña' : 'Cambiar Contraseña'}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">{getModalTitle()}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {getModalDescription()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contraseña actual - Solo si ya tiene contraseña */}
          {passwordInfo?.hasPassword && (
            <div className="space-y-2">
              <Label htmlFor="current_password" className="text-white">
                Contraseña Actual
              </Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.current_password}
                  onChange={(e) => handleInputChange('current_password', e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => toggleShowPassword('current')}
                  disabled={isLoading}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Nueva contraseña */}
          <div className="space-y-2">
            <Label htmlFor="new_password" className="text-white">
              {passwordInfo?.hasPassword ? 'Nueva Contraseña' : 'Contraseña'}
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.new_password}
                onChange={(e) => handleInputChange('new_password', e.target.value)}
                className="pr-10"
                disabled={isLoading}
                placeholder="Mínimo 8 caracteres"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => toggleShowPassword('new')}
                disabled={isLoading}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirm_password" className="text-white">
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirm_password}
                onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                className="pr-10"
                disabled={isLoading}
                placeholder="Repetir contraseña"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => toggleShowPassword('confirm')}
                disabled={isLoading}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Mensajes de error y éxito */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 text-green-400">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {passwordInfo?.hasPassword ? 'Cambiando...' : 'Estableciendo...'}
                </>
              ) : (
                passwordInfo?.hasPassword ? 'Cambiar Contraseña' : 'Establecer Contraseña'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
