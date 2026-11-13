import React, { memo, useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@heroui/react';
import { Calendar, Minus, Plus } from 'lucide-react';
import { calculatePlanDates } from '../../lib/utils';
import { DAYS_OF_WEEK } from './DayTabSelector';

interface PlanMetadataFormProps {
  planName: string;
  onPlanNameChange: (name: string) => void;
  startDateStr: string;
  onStartDateChange: (date: string) => void;
  endDateStr: string;
  onEndDateChange: (date: string) => void;
}

function PlanMetadataForm({
  planName,
  onPlanNameChange,
  startDateStr,
  onStartDateChange,
  endDateStr,
  onEndDateChange
}: PlanMetadataFormProps) {
  const [durationWeeks, setDurationWeeks] = useState(3);
  const [startDayId, setStartDayId] = useState(1); // 1 = Lunes
  const [startedBefore, setStartedBefore] = useState(false);

  // Recalculate start and end dates whenever parameters change
  useEffect(() => {
    const { startDateStr: newStart, endDateStr: newEnd } = calculatePlanDates({
      durationWeeks,
      startDayId,
      startedBefore
    });

    if (newStart !== startDateStr) {
      onStartDateChange(newStart);
    }
    if (newEnd !== endDateStr) {
      onEndDateChange(newEnd);
    }
  }, [durationWeeks, startDayId, startedBefore, onStartDateChange, onEndDateChange, startDateStr, endDateStr]);

  // Computed summary text for the date banner
  const computedRange = useMemo(() => {
    if (!startDateStr || !endDateStr) return null;
    const s = new Date(startDateStr + 'T00:00:00');
    const e = new Date(endDateStr + 'T00:00:00');

    const sFormatted = s.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
    const eFormatted = e.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startMidnight = new Date(s);
    startMidnight.setHours(0, 0, 0, 0);

    let statusText = '';
    if (startedBefore) {
      statusText = 'Plan en curso (retroactivo)';
    } else if (startMidnight.getTime() === today.getTime()) {
      statusText = 'Inicia hoy';
    } else {
      const selectedDayObj = DAYS_OF_WEEK.find(d => d.id === startDayId);
      statusText = `Inicia el próximo ${selectedDayObj ? selectedDayObj.name : 'día programado'}`;
    }

    return {
      formattedText: `${sFormatted} → ${eFormatted}`,
      statusText
    };
  }, [startDateStr, endDateStr, startedBefore, startDayId]);

  return (
    <Card className="p-3.5 sm:p-4 border border-border shadow-2xs bg-surface">
      <CardContent className="p-0 space-y-4">
        {/* Full Width Plan Name Input */}
        <div className="space-y-1.5 w-full">
          <label htmlFor="plan-name-input" className="text-xs font-bold text-foreground block">
            Nombre del Mesociclo / Plan <span className="text-emerald-500">*</span>
          </label>
          <input
            id="plan-name-input"
            type="text"
            placeholder="Ej. Plan de Carlos"
            value={planName}
            onChange={(e) => onPlanNameChange(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
          />
        </div>

        {/* Simplified Number of Weeks Selector */}
        <div className="space-y-1.5">
          <label htmlFor="duration-weeks-input" className="text-xs font-bold text-foreground block">
            Duración del Mesociclo:
          </label>
          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-border bg-surface-secondary/40">
            <span className="text-xs font-bold text-foreground">
              Número de semanas
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setDurationWeeks(prev => Math.max(1, prev - 1))}
                aria-label="Disminuir semanas"
                className="w-9 h-9 rounded-xl border border-border bg-surface text-foreground font-bold flex items-center justify-center hover:bg-surface-secondary active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                <Minus className="w-4 h-4" aria-hidden="true" />
              </button>
              <input
                id="duration-weeks-input"
                type="number"
                min={1}
                max={52}
                value={durationWeeks}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1 && val <= 52) {
                    setDurationWeeks(val);
                  }
                }}
                aria-label="Número de semanas de duración"
                className="w-14 h-9 text-center font-black text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-400 tabular-nums shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setDurationWeeks(prev => Math.min(52, prev + 1))}
                aria-label="Aumentar semanas"
                className="w-9 h-9 rounded-xl border border-border bg-surface text-foreground font-bold flex items-center justify-center hover:bg-surface-secondary active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="text-xs font-bold text-muted ml-1 select-none">semanas</span>
            </div>
          </div>
        </div>

        {/* Starting Day Selector */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground block">
            Día de inicio semanal:
          </span>
          <div role="radiogroup" aria-label="Día de inicio semanal" className="grid grid-cols-7 gap-1.5 sm:gap-2 max-w-sm sm:max-w-md">
            {DAYS_OF_WEEK.map((d) => {
              const isSelected = startDayId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Iniciar los ${d.name}s`}
                  onClick={() => setStartDayId(d.id)}
                  className={`w-full h-8 sm:h-9 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-surface border border-border text-muted hover:text-foreground hover:border-emerald-500/30'
                  }`}
                >
                  {d.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* "Comencé antes de hoy" Checkbox */}
        <label
          htmlFor="started-before-checkbox"
          className="flex items-start gap-2.5 p-2.5 rounded-xl border border-border bg-surface-secondary/40 hover:bg-surface-secondary/70 transition-colors cursor-pointer select-none"
        >
          <input
            id="started-before-checkbox"
            type="checkbox"
            checked={startedBefore}
            onChange={(e) => setStartedBefore(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-border text-emerald-500 focus:ring-emerald-400 accent-emerald-500 shrink-0 cursor-pointer"
          />
          <div className="text-xs">
            <span className="font-bold text-foreground block">
              Comencé antes de hoy
            </span>
            <span className="text-[11px] text-muted">
              Ajusta el inicio al día seleccionado de la semana en curso (retroactivo) en lugar de la próxima semana.
            </span>
          </div>
        </label>

        {/* Computed Date Range Info Card */}
        {computedRange && (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-secondary/50">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Calendar className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-foreground truncate">
                {computedRange.formattedText}
              </div>
              <div className="text-[11px] text-muted flex items-center gap-2 mt-0.5">
                <span className="tabular-nums font-semibold">{durationWeeks}&nbsp;semanas ({durationWeeks * 7}&nbsp;días)</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{computedRange.statusText}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default memo(PlanMetadataForm);
