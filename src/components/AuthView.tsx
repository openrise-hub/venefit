import React, { useState } from 'react';
import { Card, CardContent, Button } from '@heroui/react';
import { Dumbbell, LogIn, UserPlus, FlaskConical, Database, FilePlus, Eye, EyeOff, RefreshCw } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors">
      <Card className="w-full max-w-sm border border-border shadow-xl">
        <CardContent className="p-6 sm:p-8 space-y-5">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-emerald-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-black font-heading tracking-tight text-foreground">
              {isRegister ? 'Crear Cuenta' : 'Bienvenido a Venefit'}
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              {isRegister
                ? 'Registra tu perfil para gestionar tus clientes y planes'
                : 'Ingresa tus credenciales para acceder al portal'}
            </p>
          </div>

          {/* Quick Demo Options Section */}
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
              <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Opciones de Modo Demo (LocalStorage)</span>
            </div>
            <p className="text-[11px] text-center text-muted leading-relaxed">
              Prueba la plataforma sin base de datos ni servidor. Elige cómo deseas comenzar:
            </p>

            <div className="space-y-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-sm"
                onPress={() => handleStartDemo('populated')}
              >
                <Database className="w-3.5 h-3.5" aria-hidden="true" />
                <span>1. Probar con Datos de Ejemplo</span>
              </Button>
              <p className="text-[10px] text-center text-muted">
                (Clientes, mesociclos y rutina de hoy ya precargados)
              </p>

              <Button
                variant="outline"
                size="sm"
                className="w-full font-bold text-xs border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center gap-1.5 mt-2"
                onPress={() => handleStartDemo('empty')}
              >
                <FilePlus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>2. Probar desde Cero (Semilla Vacía)</span>
              </Button>
              <p className="text-[10px] text-center text-muted">
                (Sin clientes; ideal para probar el flujo de onboarding)
              </p>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-muted">o inicia con servidor</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <label htmlFor="auth-name" className="text-xs font-bold block text-foreground">
                  Nombre Completo
                </label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Ej. Carlos Entrenador"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="text-xs font-bold block text-foreground">
                Correo Electrónico
              </label>
              <input
                id="auth-email"
                type="email"
                placeholder="trainer@venefit.app"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password" className="text-xs font-bold block text-foreground">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  className="text-[11px] text-muted hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" aria-hidden="true" />
                      <span>Ocultar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" aria-hidden="true" />
                      <span>Mostrar</span>
                    </>
                  )}
                </button>
              </div>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              className="w-full mt-2 font-bold border-border"
              isDisabled={loading}
              onPress={() => handleSubmit()}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" aria-hidden="true" />
                  <span>{isRegister ? 'Registrando cuenta…' : 'Iniciando sesión…'}</span>
                </>
              ) : (
                <>
                  {isRegister ? <UserPlus className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : <LogIn className="w-4 h-4 text-emerald-400" aria-hidden="true" />}
                  <span>{isRegister ? 'Registrarse en PocketBase' : 'Iniciar Sesión (PocketBase)'}</span>
                </>
              )}
            </Button>
          </form>

          <div className="border-t border-border pt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setIsRegister(!isRegister)}
              className="text-xs font-semibold text-muted hover:text-foreground"
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
