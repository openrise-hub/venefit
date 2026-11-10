import React, { memo, useMemo } from 'react';

export const DAYS_OF_WEEK = [
  { id: 1, name: 'Lunes', short: 'Lun' },
  { id: 2, name: 'Martes', short: 'Mar' },
  { id: 3, name: 'Miércoles', short: 'Mié' },
  { id: 4, name: 'Jueves', short: 'Jue' },
  { id: 5, name: 'Viernes', short: 'Vie' },
  { id: 6, name: 'Sábado', short: 'Sáb' },
  { id: 0, name: 'Domingo', short: 'Dom' }
];

interface DayTabSelectorProps {
  selectedDaysOfWeek: number[];
  activeDayTab?: number;
  onToggleDay: (dayId: number) => void;
  onSelectActiveTab?: (dayId: number) => void;
  hideActiveTabs?: boolean;
}

function DayTabSelector({
  selectedDaysOfWeek,
  activeDayTab,
  onToggleDay,
  onSelectActiveTab,
  hideActiveTabs = false
}: DayTabSelectorProps) {
  const sortedDays = useMemo(() => {
    return [...selectedDaysOfWeek].sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
  }, [selectedDaysOfWeek]);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-bold text-foreground block mb-2">
          Días de la semana a entrenar:
        </label>
        <div
          role="group"
          aria-label="Días de la semana a entrenar"
          className="grid grid-cols-7 gap-1.5 sm:gap-2 max-w-sm sm:max-w-md"
        >
          {DAYS_OF_WEEK.map((d) => {
            const isSelected = selectedDaysOfWeek.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Entrenar los ${d.name}s`}
                onClick={() => onToggleDay(d.id)}
                className={`w-full h-10 sm:h-11 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                    : 'bg-surface border border-border text-muted hover:text-foreground hover:border-emerald-500/40'
                }`}
              >
                {d.short}
              </button>
            );
          })}
        </div>
      </div>

      {!hideActiveTabs && onSelectActiveTab && sortedDays.length > 0 && (
        <div
          role="tablist"
          aria-label="Pestañas de días de rutina seleccionados"
          className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border border-border bg-surface-secondary/50 max-w-fit"
        >
          {sortedDays.map((dayId) => {
            const dayObj = DAYS_OF_WEEK.find(d => d.id === dayId);
            const isActive = activeDayTab === dayId;
            return (
              <button
                key={dayId}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectActiveTab(dayId)}
                className={`shrink-0 font-bold text-xs h-8 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                    : 'bg-surface border border-border text-muted hover:text-foreground hover:border-emerald-500/30'
                }`}
              >
                <span>{dayObj ? dayObj.name : `Día ${dayId}`}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(DayTabSelector);
