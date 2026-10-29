import React, { useState } from 'react';
import { Card, CardContent, Input, Button } from '@heroui/react';
import { Dumbbell, LogIn, UserPlus, Sparkles, FilePlus } from 'lucide-react';
import { loginTrainer, registerTrainer, enableDevSession } from '../lib/pocketbase';
import { DemoSeedMode } from '../lib/demoData';
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
          ? 'Error al registrarte. Verifica el correo o prueba en Modo Demo.'
          : 'Correo o contraseña incorrectos o servidor no disponible.');
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDemo = (mode: DemoSeedMode) => {
    enableDevSession(mode);
    if (mode === 'populated') {
      showToast('Modo Demo Activo: Datos de ejemplo cargados (clientes, planes y series)', 'success');
    } else {
      showToast('Modo Demo Activo (Semilla Vacía): Listo para probar desde cero', 'info');
    }
    onLoginSuccess();
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

          {/* Quick Demo Options Section */}
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Opciones de Modo Demo (LocalStorage)</span>
            </div>
            <p className="text-[11px] text-center opacity-75 leading-relaxed">
              Prueba la plataforma sin base de datos ni servidor. Elige cómo deseas comenzar:
            </p>

            <div className="space-y-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1.5"
                onPress={() => handleStartDemo('populated')}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1. Probar con Datos de Ejemplo</span>
              </Button>
              <p className="text-[10px] text-center opacity-60">
                (Clientes, mesociclos y rutina de hoy ya precargados)
              </p>

              <Button
                variant="outline"
                size="sm"
                className="w-full font-bold text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 flex items-center justify-center gap-1.5 mt-2"
                onPress={() => handleStartDemo('empty')}
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>2. Probar desde Cero (Semilla Vacía)</span>
              </Button>
              <p className="text-[10px] text-center opacity-60">
                (Sin clientes; ideal para probar el flujo de onboarding)
              </p>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-muted/50"></div>
            <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider opacity-60">o inicia con servidor</span>
            <div className="flex-grow border-t border-muted/50"></div>
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
              variant="outline"
              className="w-full mt-2 font-semibold"
              isDisabled={loading}
              onPress={() => handleSubmit()}
            >
              {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isRegister ? 'Registrarse en PocketBase' : 'Iniciar Sesión (PocketBase)'}</span>
            </Button>
          </form>

          <div className="border-t pt-4 space-y-2 text-center">
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
