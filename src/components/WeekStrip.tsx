import React from 'react';
import { Card, CardContent, Button } from '@heroui/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw, CalendarDays, LayoutGrid } from 'lucide-react';
import { getWeekDates, formatDateISO } from '../lib/utils';

interface WeekStripProps {
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  viewMode?: 'daily' | 'weekly';
  onToggleViewMode?: (mode: 'daily' | 'weekly') => void;
}

export default function WeekStrip({
  selectedDateStr,
  onSelectDate,
  viewMode = 'daily',
  onToggleViewMode
}: WeekStripProps) {
  const todayStr = formatDateISO(new Date());
  const currentWeek = getWeekDates(selectedDateStr);

  const navigateWeek = (direction: number) => {
    const current = new Date(selectedDateStr + 'T00:00:00');
    current.setDate(current.getDate() + (direction * 7));
    onSelectDate(formatDateISO(current));
  };

  const selectedDateObj = new Date(selectedDateStr + 'T00:00:00');
  const monthName = selectedDateObj.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <Card className="mb-4 sm:mb-5 shadow-xs border border-border bg-surface">
      <CardContent className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
        {/* Row 1: Month Name & Navigation Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Month & Year badge */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CalendarIcon className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-foreground truncate">
              {monthName}
            </span>
          </div>

          {/* Quick Date Navigation Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <label htmlFor="weekstrip-date" className="sr-only">
              Seleccionar fecha
            </label>
            <input
              id="weekstrip-date"
              type="date"
              aria-label="Seleccionar fecha"
              value={selectedDateStr}
              onChange={(e) => {
                if (e.target.value) onSelectDate(e.target.value);
              }}
              className="text-[11px] font-bold rounded-lg px-2 py-1 cursor-pointer border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-400 max-w-[110px] sm:max-w-none"
            />

            {selectedDateStr !== todayStr && (
              <button
                type="button"
                onClick={() => onSelectDate(todayStr)}
                aria-label="Ir al día de hoy"
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span className="hidden xs:inline">Hoy</span>
              </button>
            )}

            <div className="flex items-center gap-0.5 border border-border rounded-lg p-0.5 bg-background">
              <button
                type="button"
                onClick={() => navigateWeek(-1)}
                aria-label="Semana anterior"
                title="Semana anterior"
                className="p-1 rounded text-muted hover:text-foreground hover:bg-surface-secondary transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigateWeek(1)}
                aria-label="Semana siguiente"
                title="Semana siguiente"
                className="p-1 rounded text-muted hover:text-foreground hover:bg-surface-secondary transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: 7-Day Calendar Strip - Full width, perfect touch targets */}
        <div
          role="region"
          aria-label="Días de la semana"
          className="grid grid-cols-7 gap-1 sm:gap-1.5 bg-surface-secondary/40 p-1 sm:p-1.5 rounded-2xl border border-border"
        >
          {currentWeek.map((day) => {
            const isSelected = day.dateStr === selectedDateStr;
            const isToday = day.dateStr === todayStr;

            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => onSelectDate(day.dateStr)}
                aria-current={isSelected ? 'date' : undefined}
                aria-label={`${day.dayName} ${day.dayNum} de ${monthName}${isToday ? ', Hoy' : ''}${isSelected ? ', seleccionado' : ''}`}
                className={`w-full flex flex-col items-center justify-center py-2 sm:py-2.5 px-0.5 sm:px-1 rounded-xl transition-all duration-150 cursor-pointer select-none text-center ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-sm ring-2 ring-emerald-400'
                    : isToday
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-surface hover:bg-surface-secondary text-foreground/80 hover:text-foreground border border-border/50 shadow-2xs'
                }`}
              >
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-75">
                  {day.dayName}
                </span>
                <span className="text-xs sm:text-sm font-black mt-0.5 tabular-nums">
                  {day.dayNum}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Compact Segmented Switcher for Daily vs Weekly View */}
        {onToggleViewMode && (
          <div
            role="group"
            aria-label="Modo de vista"
            className="grid grid-cols-2 gap-1 bg-surface-secondary/70 p-1 rounded-xl border border-border"
          >
            <button
              type="button"
              onClick={() => onToggleViewMode('daily')}
              aria-pressed={viewMode === 'daily'}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                viewMode === 'daily'
                  ? 'bg-surface text-emerald-500 shadow-2xs border border-border'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Vista Diaria</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleViewMode('weekly')}
              aria-pressed={viewMode === 'weekly'}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                viewMode === 'weekly'
                  ? 'bg-surface text-emerald-500 shadow-2xs border border-border'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Vista Semanal</span>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
