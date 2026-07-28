import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { getWeekDates, formatDateISO } from '../lib/utils';

export default function WeekStrip({ selectedDateStr, onSelectDate }) {
  const todayStr = formatDateISO(new Date());
  const currentWeek = getWeekDates(new Date(selectedDateStr + 'T00:00:00'));

  const navigateWeek = (direction) => {
    const current = new Date(selectedDateStr + 'T00:00:00');
    current.setDate(current.getDate() + (direction * 7));
    onSelectDate(formatDateISO(current));
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-5 shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={selectedDateStr}
            onChange={(e) => {
              if (e.target.value) onSelectDate(e.target.value);
            }}
            className="bg-slate-950 text-slate-300 text-xs border border-slate-800 rounded-xl px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
            title="Seleccionar fecha"
          />

          {selectedDateStr !== todayStr && (
            <button
              onClick={() => onSelectDate(todayStr)}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Hoy</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
              title="Semana anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateWeek(1)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
              title="Semana siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {currentWeek.map((day) => {
          const isSelected = day.dateStr === selectedDateStr;
          const isToday = day.dateStr === todayStr;

          return (
            <button
              key={day.dateStr}
              onClick={() => onSelectDate(day.dateStr)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02] font-extrabold'
                  : isToday
                  ? 'bg-slate-800/90 border-emerald-500/50 text-emerald-400 font-bold'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span className="text-[10px] sm:text-xs tracking-tight uppercase opacity-80">
                {day.shortDay}
              </span>
              <span className="text-sm sm:text-base font-black my-0.5">
                {day.dayNumber}
              </span>
              {isToday && !isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
