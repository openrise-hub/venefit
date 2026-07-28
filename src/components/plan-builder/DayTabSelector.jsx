import React, { memo } from 'react';

const DAYS_OF_WEEK = [
  { id: 1, name: 'Lunes', short: 'Lun' },
  { id: 2, name: 'Martes', short: 'Mar' },
  { id: 3, name: 'Miércoles', short: 'Mié' },
  { id: 4, name: 'Jueves', short: 'Jue' },
  { id: 5, name: 'Viernes', short: 'Vie' },
  { id: 6, name: 'Sábado', short: 'Sáb' },
  { id: 0, name: 'Domingo', short: 'Dom' }
];

function DayTabSelector({
  selectedDaysOfWeek,
  activeDayTab,
  onToggleDay,
  onSelectActiveTab
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-bold text-slate-300 block mb-2">
          Días de la semana a entrenar:
        </label>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS_OF_WEEK.map((d) => {
            const isSelected = selectedDaysOfWeek.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onToggleDay(d.id)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {d.short}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDaysOfWeek.length > 0 && (
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
          {selectedDaysOfWeek.map((dayId) => {
            const dayObj = DAYS_OF_WEEK.find(d => d.id === dayId);
            const active = activeDayTab === dayId;
            return (
              <button
                key={dayId}
                type="button"
                onClick={() => onSelectActiveTab(dayId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  active
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                {dayObj ? dayObj.name : 'Día'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(DayTabSelector);
