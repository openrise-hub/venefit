import React from 'react';
import { Button } from '@heroui/react';
import { Calendar, Plus, Users } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPlanBuilder: () => void;
}

export default function Navigation({ activeTab, setActiveTab, onOpenPlanBuilder }: NavigationProps) {
  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Navegación móvil principal"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-6 py-1.5 flex items-center justify-between border-t border-border bg-background/95 backdrop-blur-xl safe-bottom shadow-lg transition-colors"
      >
        {/* Rutinas Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('workout')}
          aria-label="Rutinas y Calendario"
          aria-current={activeTab === 'workout' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'workout'
              ? 'text-emerald-500 font-black'
              : 'text-muted hover:text-foreground font-semibold'
          }`}
        >
          <Calendar className={`w-5 h-5 mb-0.5 ${activeTab === 'workout' ? 'stroke-[2.5]' : 'stroke-2'}`} aria-hidden="true" />
          <span className="text-[10px] tracking-tight">Rutinas</span>
        </button>

        {/* Central Floating Action Button (Nuevo Plan) */}
        <div className="relative -top-4 flex flex-col items-center">
          <button
            type="button"
            onClick={onOpenPlanBuilder}
            aria-label="Crear nuevo plan de entrenamiento"
            title="Crear Nuevo Plan"
            className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/35 flex items-center justify-center active:scale-90 transition-transform cursor-pointer border-3 border-background ring-2 ring-emerald-500/20"
          >
            <Plus className="w-6 h-6 stroke-[3]" aria-hidden="true" />
          </button>
          <span className="text-[9px] font-bold text-muted -mb-1 mt-0.5">Plan</span>
        </div>

        {/* Clientes Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('clients')}
          aria-label="Lista de Clientes"
          aria-current={activeTab === 'clients' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'clients'
              ? 'text-emerald-500 font-black'
              : 'text-muted hover:text-foreground font-semibold'
          }`}
        >
          <Users className={`w-5 h-5 mb-0.5 ${activeTab === 'clients' ? 'stroke-[2.5]' : 'stroke-2'}`} aria-hidden="true" />
          <span className="text-[10px] tracking-tight">Clientes</span>
        </button>
      </nav>

      {/* Desktop Top Sub-navigation Bar */}
      <nav
        aria-label="Navegación principal de escritorio"
        className="hidden md:block border-b border-border bg-surface/40 backdrop-blur-sm px-4 py-2.5 transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'workout' ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setActiveTab('workout')}
              aria-current={activeTab === 'workout' ? 'page' : undefined}
              className={`font-bold text-xs h-9 px-3.5 rounded-xl transition-all ${
                activeTab === 'workout' ? 'shadow-xs' : 'text-foreground/75 hover:text-foreground'
              }`}
            >
              <Calendar className="w-4 h-4 mr-1.5" aria-hidden="true" />
              <span>Rutinas & Calendario</span>
            </Button>

            <Button
              variant={activeTab === 'clients' ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setActiveTab('clients')}
              aria-current={activeTab === 'clients' ? 'page' : undefined}
              className={`font-bold text-xs h-9 px-3.5 rounded-xl transition-all ${
                activeTab === 'clients' ? 'shadow-xs' : 'text-foreground/75 hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4 mr-1.5" aria-hidden="true" />
              <span>Lista de Clientes</span>
            </Button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onPress={onOpenPlanBuilder}
            aria-label="Crear nuevo plan de entrenamiento"
            className="font-bold text-xs h-9 px-4 rounded-xl shadow-xs active:scale-98 transition-transform"
          >
            <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
            <span>Crear Plan de Entrenamiento</span>
          </Button>
        </div>
      </nav>
    </>
  );
}
