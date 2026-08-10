import React, { useState } from 'react';
import { ModalBackdrop, ModalContainer, ModalDialog, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalCloseTrigger, Input, Button } from '@heroui/react';
import { Dumbbell, LogIn, UserPlus } from 'lucide-react';
import { loginTrainer, registerTrainer } from '../lib/pocketbase';
import { showToast } from '../lib/toastStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      showToast('Por favor completa tu email y contraseña', 'info');
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        await registerTrainer(email.trim(), password.trim(), name.trim());
        showToast('¡Cuenta creada exitosamente!', 'success');
      } else {
        await loginTrainer(email.trim(), password.trim());
        showToast('¡Sesión iniciada correctamente!', 'success');
      }

      onLoginSuccess();
      onClose();
    } catch (err) {
      console.error('[LoginModal] Auth error:', err);
      showToast(
        isRegister
          ? 'Error al crear la cuenta. Verifica el email.'
          : 'Credenciales incorrectas.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBackdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContainer size="sm" placement="center" className="p-3 sm:p-4 my-auto flex items-center justify-center">
        <ModalDialog className="w-full max-w-sm mx-auto my-auto overflow-hidden">
          <ModalHeader className="flex items-center justify-between border-b pb-4">
            <div className="flex flex-col items-center gap-1 text-center w-full">
              <Dumbbell className="w-8 h-8 text-emerald-400" />
              <ModalHeading className="text-base font-bold">{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</ModalHeading>
              <p className="text-xs font-normal opacity-70">
                {isRegister
                  ? 'Registra tu perfil para gestionar tus clientes'
                  : 'Ingresa para acceder a tus clientes y rutinas'}
              </p>
            </div>
            <ModalCloseTrigger onClick={onClose} />
          </ModalHeader>

          <ModalBody className="py-5 space-y-4">
            {isRegister && (
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold block opacity-80">Nombre Completo</label>
                <Input
                  placeholder="Ej. Carlos Entrenador"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold block opacity-80">Correo Electrónico</label>
              <Input
                type="email"
                placeholder="trainer@venefit.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold block opacity-80">Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </ModalBody>

          <ModalFooter className="border-t pt-4 flex flex-col gap-2.5">
            <Button
              variant="primary"
              isDisabled={loading}
              onPress={handleSubmit}
            >
              {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onPress={() => setIsRegister(!isRegister)}
            >
              {isRegister
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Registrate gratis'}
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
