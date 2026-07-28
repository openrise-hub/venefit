import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalDialog, Input, Button } from '@heroui/react';
import { Dumbbell, Lock, Mail, User, LogIn, UserPlus } from 'lucide-react';
import { loginTrainer, registerTrainer } from '../lib/pocketbase';
import { showToast } from '../lib/toastStore';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Por favor completa tu email y contraseña', 'info');
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        await registerTrainer(email.trim(), password.trim(), name.trim());
        showToast('¡Cuenta de Entrenador creada exitosamente!', 'success');
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
          ? 'Error al crear la cuenta. Verifica que el email no esté registrado.'
          : 'Credenciales incorrectas. Verifica tu email y contraseña.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <ModalDialog className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-md rounded-2xl shadow-2xl p-4">
        <ModalHeader className="flex flex-col items-center gap-1 text-center border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-1">
            <Dumbbell className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <h3 className="text-lg font-extrabold text-white">
            {isRegister ? 'Crear Cuenta de Entrenador' : 'Acceso Personal Trainer'}
          </h3>
          <p className="text-xs text-slate-400 font-normal">
            {isRegister 
              ? 'Registra tu perfil para gestionar tus atletas y rutinas' 
              : 'Ingresa para acceder a tus clientes y entrenamientos'}
          </p>
        </ModalHeader>

        <ModalBody className="py-4 space-y-3">
          {isRegister && (
            <Input
              label="Nombre Completo"
              placeholder="Ej. Entrenador Carlos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              startContent={<User className="w-4 h-4 text-slate-400" />}
              variant="bordered"
            />
          )}

          <Input
            type="email"
            label="Correo Electrónico"
            placeholder="trainer@venefit.app"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startContent={<Mail className="w-4 h-4 text-slate-400" />}
            variant="bordered"
          />

          <Input
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startContent={<Lock className="w-4 h-4 text-slate-400" />}
            variant="bordered"
          />
        </ModalBody>

        <ModalFooter className="flex flex-col gap-2 border-t border-slate-800 pt-3">
          <Button
            color="success"
            className="w-full font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20"
            isLoading={loading}
            onPress={handleSubmit}
            startContent={!loading && (isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />)}
          >
            {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </Button>

          <Button
            variant="light"
            size="sm"
            onPress={() => setIsRegister(!isRegister)}
            className="text-slate-400 hover:text-emerald-400 text-xs"
          >
            {isRegister 
              ? '¿Ya tienes cuenta? Inicia sesión aquí' 
              : '¿No tienes cuenta? Registrate gratis como Entrenador'}
          </Button>
        </ModalFooter>
      </ModalDialog>
    </div>
  );
}
