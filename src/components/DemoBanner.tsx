import React, { useState } from 'react';
import { Button, Chip } from '@heroui/react';
import { Sparkles, RotateCcw, LogOut, FilePlus, RefreshCw } from 'lucide-react';
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
    <aside aria-label="Aviso de Modo Demostración" className="bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-teal-950/80 border-b border-emerald-500/30 px-3 sm:px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Chip
            size="sm"
            variant="primary"
            className="font-black text-[10px] tracking-wider uppercase bg-emerald-500 text-slate-950 shrink-0"
          >
            <Sparkles className="w-3 h-3 mr-1 inline" />
            Modo Demo ({currentMode === 'populated' ? 'Con Datos' : 'Semilla Vacía'})
          </Chip>
          <p className="text-xs text-emerald-200/90 font-medium truncate hidden md:inline">
            Modo autónomo en LocalStorage sin servidor. Puedes alternar entre datos de ejemplo o iniciar desde cero.
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {currentMode !== 'populated' ? (
            <Button
              size="sm"
              variant="outline"
              className="text-xs font-bold border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 h-7 px-2.5"
              onPress={handleLoadPopulated}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              <span>Cargar Datos Ejemplo</span>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="text-xs font-bold border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 h-7 px-2.5"
              onPress={handleLoadPopulated}
              title="Restaura los 3 clientes y rutinas de ejemplo originales"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Reiniciar Ejemplos</span>
            </Button>
          )}

          {currentMode !== 'empty' && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs font-bold border-slate-700 text-slate-300 hover:bg-slate-800 h-7 px-2"
              onPress={handleClearToEmpty}
              title="Borra todos los clientes para probar el registro desde cero"
            >
              <FilePlus className="w-3 h-3 mr-1" />
              <span>Vaciar a Modo Limpio</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="text-xs font-semibold text-slate-300 hover:text-white h-7 px-2"
            onPress={handleExit}
          >
            <LogOut className="w-3 h-3 mr-1" />
            <span>Salir</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
