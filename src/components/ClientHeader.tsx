import React from 'react';
import { Target, Weight, Ruler, Trash2, Plus } from 'lucide-react';

export default function ClientHeader({ 
  client, 
  plans = [], 
  onOpenPlanBuilder, 
  onDeleteClient 
}) {
  if (!client) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden mb-5">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-emerald-400 shrink-0 shadow-md">
            {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {client.name}
              </h2>
              {plans.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                  {plans.length} Plan{plans.length > 1 ? 'es' : ''}
                </span>
              )}
            </div>
            {client.goal && (
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{client.goal}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-xs">
          {client.current_weight && (
            <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3">
              <Weight className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">Peso</span>
                <span className="font-bold text-slate-200">{client.current_weight} kg</span>
              </div>
            </div>
          )}

          {client.height && (
            <div className="flex items-center gap-1.5 pr-2">
              <Ruler className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">Altura</span>
                <span className="font-bold text-slate-200">{client.height} cm</span>
              </div>
            </div>
          )}

          <button
            onClick={onOpenPlanBuilder}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Plan</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm(`¿Estás seguro de eliminar a ${client.name}?`)) {
                onDeleteClient(client.id);
              }
            }}
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
            title="Eliminar cliente"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
