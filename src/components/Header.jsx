import React from 'react';
import { Dumbbell, Users, Plus, UserCheck, LogOut } from 'lucide-react';
import { getCurrentTrainer, logoutTrainer } from '../lib/pocketbase';

export default function Header({ 
  clients = [], 
  selectedClient, 
  onSelectClient, 
  onOpenNewClientModal,
  onOpenLoginModal 
}) {
  const currentTrainer = getCurrentTrainer();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Dumbbell className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white font-heading">
              Venefit <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">Pro</span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Personal Trainer Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedClient ? selectedClient.id : ''}
              onChange={(e) => {
                const found = clients.find(c => c.id === e.target.value);
                if (found) onSelectClient(found);
              }}
              className="appearance-none bg-slate-900 text-slate-200 border border-slate-700/80 hover:border-emerald-500/50 text-xs md:text-sm font-medium rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer max-w-[150px] sm:max-w-[220px] truncate"
            >
              {clients.length === 0 ? (
                <option value="">No hay clientes</option>
              ) : (
                clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    👤 {c.name}
                  </option>
                ))
              )}
            </select>
            <Users className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={onOpenNewClientModal}
            title="Agregar Cliente"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Cliente</span>
          </button>

          {currentTrainer ? (
            <button
              onClick={() => logoutTrainer()}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-rose-400 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              title={`Sesión activa: ${currentTrainer.email}. Clic para salir.`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline truncate max-w-[100px]">
                {currentTrainer.name || currentTrainer.email.split('@')[0]}
              </span>
              <LogOut className="w-3.5 h-3.5 text-slate-500 hover:text-rose-400" />
            </button>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Iniciar Sesión de Entrenador"
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Acceso Trainer</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
