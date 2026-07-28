import React from 'react';
import { Calendar, PlusCircle, Users } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab, onOpenPlanBuilder }) {
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 px-4 py-2 flex items-center justify-around safe-bottom">
        <button
          onClick={() => setActiveTab('workout')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'workout' 
              ? 'text-emerald-400 font-bold scale-105' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Rutinas</span>
        </button>

        <button
          onClick={onOpenPlanBuilder}
          className="flex flex-col items-center justify-center w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/30 active:scale-90 transition-all font-bold"
          title="Crear Nuevo Plan"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'clients' 
              ? 'text-emerald-400 font-bold scale-105' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Clientes</span>
        </button>
      </nav>

      <div className="hidden md:block bg-slate-900/60 border-b border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('workout')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'workout'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Rutinas & Calendario
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'clients'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              Lista de Clientes
            </button>
          </div>

          <button
            onClick={onOpenPlanBuilder}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Crear Plan de Entrenamiento
          </button>
        </div>
      </div>
    </>
  );
}
