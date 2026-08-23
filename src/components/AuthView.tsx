import React, { useState } from 'react';
import { Card, CardContent, Input, Button } from '@heroui/react';
import { Dumbbell, LogIn, UserPlus } from 'lucide-react';
import { loginTrainer, registerTrainer } from '../lib/pocketbase';
import { showToast } from '../lib/toastStore';

interface AuthViewProps {
  onLoginSuccess: () => void;
}

export default function AuthView({ onLoginSuccess }: AuthViewProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Por favor completa tu correo y contraseña', 'info');
      return;
    }

    if (password.length < 8) {
      showToast('La contraseña debe tener al menos 8 caracteres', 'info');
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        if (!name.trim()) {
          showToast('Ingresa tu nombre completo', 'info');
          setLoading(false);
          return;
        }
        await registerTrainer(email.trim(), password.trim(), name.trim());
        showToast('¡Cuenta creada exitosamente!', 'success');
      } else {
        await loginTrainer(email.trim(), password.trim());
        showToast('¡Sesión iniciada correctamente!', 'success');
      }

      onLoginSuccess();
    } catch (err: any) {
      console.error('[AuthView] Auth error:', err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        (isRegister
          ? 'Error al registrarte. Verifica el correo.'
          : 'Correo o contraseña incorrectos.');
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 sm:p-8 space-y-5">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl border flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-xl font-black font-heading tracking-tight">
              {isRegister ? 'Crear Cuenta' : 'Bienvenido a Venefit'}
            </h2>
            <p className="text-xs opacity-70">
              {isRegister
                ? 'Registra tu perfil para gestionar tus clientes y planes'
                : 'Ingresa tus credenciales para acceder al portal'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold block opacity-80">Nombre Completo</label>
                <Input
                  placeholder="Ej. Carlos Entrenador"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold block opacity-80">Correo Electrónico</label>
              <Input
                type="email"
                placeholder="trainer@venefit.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold block opacity-80">Contraseña</label>
              <Input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isDisabled={loading}
              onPress={() => handleSubmit()}
            >
              {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</span>
            </Button>
          </form>

          <div className="border-t pt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setIsRegister(!isRegister)}
            >
              {isRegister
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
