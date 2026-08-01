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
      <ModalContainer size="sm">
        <ModalDialog>
          <ModalHeader>
            <div className="flex flex-col items-center gap-1 text-center w-full">
              <Dumbbell className="w-8 h-8" />
              <ModalHeading>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</ModalHeading>
              <p className="text-xs font-normal">
                {isRegister
                  ? 'Registra tu perfil para gestionar tus atletas'
                  : 'Ingresa para acceder a tus clientes y rutinas'}
              </p>
            </div>
            <ModalCloseTrigger onClick={onClose} />
          </ModalHeader>

          <ModalBody className="gap-3">
            {isRegister && (
              <Input
                placeholder="Nombre Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <Input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </ModalBody>

          <ModalFooter className="flex flex-col gap-2">
            <Button
              variant="primary"
              isDisabled={loading}
              onPress={handleSubmit}
            >
              {isRegister ? <UserPlus /> : <LogIn />}
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
