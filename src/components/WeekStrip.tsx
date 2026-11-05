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

  return (
    <Card className="mb-5 shadow-xs border border-divider">
      <CardContent className="p-3 sm:p-4">
        {/* Top Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          {/* Left: Month info & View mode switcher */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CalendarIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-foreground">
                {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            {onToggleViewMode && (
              <div className="flex items-center bg-default-100 dark:bg-zinc-800 p-1 rounded-xl border border-default-200/70 shadow-xs">
                <button
                  type="button"
                  onClick={() => onToggleViewMode('daily')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    viewMode === 'daily'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-foreground/70 hover:text-foreground hover:bg-default-200/60'
                  }`}
                  title="Ver entrenamiento del día seleccionado"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Vista Diaria</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleViewMode('weekly')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    viewMode === 'weekly'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-foreground/70 hover:text-foreground hover:bg-default-200/60'
                  }`}
                  title="Ver resumen de los 7 días de la semana"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Vista Semanal</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Date Picker, Today button, Prev/Next buttons */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <input
              type="date"
              value={selectedDateStr}
              onChange={(e) => {
                if (e.target.value) onSelectDate(e.target.value);
              }}
              className="text-xs rounded-xl px-2.5 py-1.5 cursor-pointer border border-default-200 bg-background text-foreground"
            />

            {selectedDateStr !== todayStr && (
              <Button
                size="sm"
                variant="ghost"
                onPress={() => onSelectDate(todayStr)}
                className="font-bold text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Hoy</span>
              </Button>
            )}

            <div className="flex items-center gap-0.5 border border-default-200 rounded-xl p-0.5 bg-background">
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => navigateWeek(-1)}
                title="Semana anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => navigateWeek(1)}
                title="Semana siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 7-Day Calendar Strip - Full width tiles with no empty voids */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 bg-default-100/50 dark:bg-zinc-900/40 p-1.5 rounded-2xl border border-default-200/50">
          {currentWeek.map((day) => {
            const isSelected = day.dateStr === selectedDateStr;
            const isToday = day.dateStr === todayStr;

            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => onSelectDate(day.dateStr)}
                className={`w-full flex flex-col items-center justify-center py-2.5 px-1 sm:px-2 rounded-xl transition-all duration-150 cursor-pointer select-none text-center ${
                  isSelected
                    ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400'
                    : isToday
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-background hover:bg-default-200/70 text-foreground/80 hover:text-foreground border border-default-200/40 shadow-xs'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                  {day.dayName}
                </span>
                <span className="text-sm font-black mt-0.5">
                  {day.dayNum}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
