import React, { memo } from 'react';

const DURATION_PRESETS = [
  { label: '1 Semana', days: 7 },
  { label: '1 Mes (30 días)', days: 30 },
  { label: '3 Meses (Trimestral)', days: 90 },
  { label: '6 Meses (Semestral)', days: 180 }
];

function PlanMetadataForm({
  planName,
  onPlanNameChange,
  startDateStr,
  onStartDateChange,
  endDateStr,
  onEndDateChange,
  onPresetSelect
}) {
  return (
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
      <div>
        <label className="text-xs font-bold text-slate-300 block mb-1">Nombre del Plan</label>
        <input
          type="text"
          value={planName}
          onChange={(e) => onPlanNameChange(e.target.value)}
          className="w-full bg-slate-900 text-white text-sm px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
          placeholder="Ej. Hipertrofia 12 Semanas"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Fecha de Inicio</label>
          <input
            type="date"
            value={startDateStr}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Fecha Final</label>
          <input
            type="date"
            value={endDateStr}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Atajos de Duración:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {DURATION_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onPresetSelect(preset.days)}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 text-xs rounded-lg font-semibold transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(PlanMetadataForm);
