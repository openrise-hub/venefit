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
  }, [toast]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4">
      <div className={`p-4 rounded-2xl border shadow-2xl flex items-start justify-between gap-3 backdrop-blur-md ${
        isError
          ? 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-500/10'
          : isSuccess
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-500/10'
          : 'bg-slate-900/90 border-slate-700 text-slate-200 shadow-slate-500/10'
      }`}>
        <div className="flex items-start gap-2.5">
          {isError && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {!isError && !isSuccess && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">
              {isError ? 'Error de Operación' : isSuccess ? 'Éxito' : 'Aviso'}
            </h4>
            <p className="text-xs mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
        </div>

        <button
          onClick={clearToast}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
