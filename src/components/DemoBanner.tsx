import React, { useState } from 'react';
import { Button, Chip } from '@heroui/react';
import { FlaskConical, RotateCcw, LogOut, FilePlus, RefreshCw } from 'lucide-react';
import { resetDemoDataToPopulated, resetDemoDataToEmpty, getDemoSeedMode } from '../lib/demoData';
import { logoutTrainer } from '../lib/pocketbase';
import { showToast } from '../lib/toastStore';

interface DemoBannerProps {
  onResetData: () => void;
}

export default function DemoBanner({ onResetData }: DemoBannerProps) {
  const [currentMode, setCurrentMode] = useState(() => getDemoSeedMode());

  const handleLoadPopulated = () => {
    resetDemoDataToPopulated();
    setCurrentMode('populated');
    showToast('Datos de ejemplo cargados (clientes, planes y entrenamientos)', 'success');
    onResetData();
  };

  const handleClearToEmpty = () => {
    if (window.confirm('¿Deseas vaciar los datos de prueba? Esto dejará la lista en 0 clientes para probar el flujo de onboarding desde cero.')) {
      resetDemoDataToEmpty();
      setCurrentMode('empty');
      showToast('Datos vaciados. Listo para probar desde cero', 'info');
      onResetData();
    }
  };

  const handleExit = () => {
    logoutTrainer();
    showToast('Sesión de demo finalizada', 'info');
  };

  return (
    <aside
      aria-label="Aviso de Modo Demostración"
      className="bg-zinc-900 border-b border-emerald-500/30 px-3 py-1.5 text-zinc-100 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0">
            <FlaskConical className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>Demo {currentMode === 'populated' ? 'Datos' : 'Limpio'}</span>
          </div>
          <span className="text-[11px] text-zinc-400 truncate hidden sm:inline">
            LocalStorage sin servidor
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {currentMode !== 'populated' ? (
            <button
              type="button"
              onClick={handleLoadPopulated}
              aria-label="Cargar datos de ejemplo"
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" aria-hidden="true" />
              <span>Ejemplos</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLoadPopulated}
              aria-label="Reiniciar datos de ejemplo originales"
              title="Restaura los 3 clientes y rutinas de ejemplo originales"
              className="text-[11px] font-bold text-zinc-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Reiniciar</span>
            </button>
          )}

          {currentMode !== 'empty' && (
            <button
              type="button"
              onClick={handleClearToEmpty}
              aria-label="Vaciar a modo limpio con 0 clientes"
              title="Borra todos los clientes para probar el registro desde cero"
              className="text-[11px] font-bold text-zinc-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <FilePlus className="w-3 h-3" aria-hidden="true" />
              <span className="hidden xs:inline">Vaciar</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExit}
            aria-label="Salir de la sesión de demostración"
            className="text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LogOut className="w-3 h-3" aria-hidden="true" />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
