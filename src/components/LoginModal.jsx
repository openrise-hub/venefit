import React, { useState } from 'react';
import { Dumbbell, Lock, Mail, User, LogIn, UserPlus, X } from 'lucide-react';
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
    e.preventDefault();
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto mb-2">
            <Dumbbell className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <h3 className="text-lg font-extrabold text-white font-heading">
            {isRegister ? 'Crear Cuenta de Entrenador' : 'Acceso Personal Trainer'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRegister 
              ? 'Registra tu perfil para gestionar tus atletas y rutinas' 
              : 'Ingresa para acceder a tus clientes y entrenamientos'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {isRegister && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ej. Entrenador Carlos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="trainer@venefit.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all mt-2"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {loading ? 'Procesando...' : isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </button>

          <div className="text-center pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-all font-medium"
            >
              {isRegister 
                ? '¿Ya tienes cuenta? Inicia sesión aquí' 
                : '¿No tienes cuenta? Registrate gratis como Entrenador'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
