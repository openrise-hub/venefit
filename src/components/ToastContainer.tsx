import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, X } from 'lucide-react';
import { useToast } from '../lib/toastStore';

export default function ToastContainer() {
  const { toast, clearToast } = useToast();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4"
    >
      <div className={`p-4 rounded-2xl border shadow-2xl flex items-start justify-between gap-3 backdrop-blur-md transition-colors ${
        isError
          ? 'bg-rose-950/95 dark:bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-500/10'
          : isSuccess
          ? 'bg-emerald-950/95 dark:bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-500/10'
          : 'bg-zinc-900/95 dark:bg-zinc-900/90 border-zinc-700 text-zinc-100 shadow-black/20'
      }`}>
        <div className="flex items-start gap-2.5">
          {isError && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />}
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />}
          {!isError && !isSuccess && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">
              {isError ? 'Error' : isSuccess ? 'Éxito' : 'Aviso'}
            </h4>
            <p className="text-xs mt-0.5 leading-relaxed font-medium">{toast.message}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearToast}
          aria-label="Cerrar notificación"
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
