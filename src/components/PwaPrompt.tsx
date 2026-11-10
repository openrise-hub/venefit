import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function PwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('venefit_pwa_dismissed')) {
      return;
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('venefit_pwa_dismissed', 'true');
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      sessionStorage.setItem('venefit_pwa_dismissed', 'true');
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <aside
      aria-label="Aviso de instalación de la aplicación"
      className="fixed bottom-20 md:bottom-6 left-3 right-3 sm:right-auto sm:left-4 sm:max-w-sm z-30 bg-surface/95 text-foreground border border-emerald-500/40 rounded-2xl p-2.5 sm:p-3 shadow-xl backdrop-blur-xl flex items-center justify-between gap-2.5 animate-in fade-in slide-in-from-bottom-2 transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-black text-foreground truncate">Instalar Venefit</h4>
          <p className="text-[10px] text-muted line-clamp-1">Acceso rápido y offline.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={handleInstall}
          aria-label="Instalar Venefit"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-lg text-[11px] font-black shadow-xs transition-all cursor-pointer"
        >
          Instalar
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Descartar aviso de instalación"
          className="text-muted hover:text-foreground p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
