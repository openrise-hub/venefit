import React from 'react';
import { Card, CardContent, Chip, Button } from '@heroui/react';
import { Calendar, Dumbbell, Coffee, ArrowRight, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { useWeekRoutinesList } from '../lib/useWorkoutData';
import { getWeekDates, formatDateISO } from '../lib/utils';

interface WeeklyOverviewViewProps {
  clientId: string;
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  onSwitchToDailyView: () => void;
  onOpenPlanBuilder: () => void;
}

export default function WeeklyOverviewView({
  clientId,
  selectedDateStr,
  onSelectDate,
  onSwitchToDailyView,
  onOpenPlanBuilder
}: WeeklyOverviewViewProps) {
  const currentWeekDays = getWeekDates(selectedDateStr);
  const weekDateStrings = currentWeekDays.map(d => d.dateStr);
  const { weekData, isLoading } = useWeekRoutinesList(clientId, weekDateStrings);
  const todayStr = formatDateISO(new Date());

  const totalRoutinesInWeek = Object.values(weekData).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold font-heading">
                  Resumen Semanal de Entrenamientos
                </h3>
                <Chip size="sm" variant="primary" className="text-[10px] font-bold">
                  {totalRoutinesInWeek} días activos
                </Chip>
              </div>
              <p className="text-xs opacity-70 mt-0.5">
                Semana del {currentWeekDays[0]?.dayNum} al {currentWeekDays[6]?.dayNum} ({new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })})
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="font-bold text-xs border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
            onPress={onOpenPlanBuilder}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Crear / Modificar Plan</span>
          </Button>
        </CardContent>
      </Card>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {currentWeekDays.map((day) => {
          const isSelected = day.dateStr === selectedDateStr;
          const isToday = day.dateStr === todayStr;
          const dayWorkout = weekData[day.dateStr];
          const hasRoutine = Boolean(dayWorkout && dayWorkout.routine);
          const exercises = dayWorkout?.exercises || [];

          return (
            <div
              key={day.dateStr}
              onClick={() => {
                onSelectDate(day.dateStr);
                if (hasRoutine) {
                  onSwitchToDailyView();
                }
              }}
              className="cursor-pointer group"
            >
              <Card
                className={`h-full transition-all duration-200 border ${
                  isSelected
                    ? 'border-emerald-400 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-400'
                    : isToday
                    ? 'border-emerald-500/50'
                    : 'hover:border-foreground/30'
                }`}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                  {/* Day Header */}
                  <div className="flex items-center justify-between border-b pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-foreground">
                        {day.dayName}
                      </span>
                      <span className="text-base font-black text-emerald-400">
                        {day.dayNum}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isToday && (
                        <Chip size="sm" variant="primary" className="text-[9px] font-black uppercase">
                          Hoy
                        </Chip>
                      )}
                      {isSelected && !isToday && (
                        <Chip size="sm" variant="soft" className="text-[9px] font-bold">
                          Seleccionado
                        </Chip>
                      )}
                    </div>
                  </div>

                  {/* Day Body */}
                  {hasRoutine ? (
                    <div className="space-y-2.5 flex-1">
                      <div>
                        <h4 className="text-sm font-bold text-foreground group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {dayWorkout.routine.routine_name}
                        </h4>

                        {dayWorkout.routine.muscle_groups && dayWorkout.routine.muscle_groups.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {dayWorkout.routine.muscle_groups.map((mg, i) => (
                              <Chip key={i} size="sm" variant="soft" className="text-[9px] font-semibold">
                                {mg}
                              </Chip>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Mini exercise preview */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">
                          Ejercicios ({exercises.length}):
                        </span>
                        <div className="space-y-1">
                          {exercises.slice(0, 3).map((ex, i) => {
                            const exName = ex.expandedExercise?.name || (typeof ex.exercise === 'object' ? (ex.exercise as any).name : 'Ejercicio');
                            return (
                              <div key={ex.id || i} className="text-[11px] opacity-80 flex items-center justify-between gap-1">
                                <span className="truncate">• {exName}</span>
                                <span className="text-[10px] font-bold opacity-60 shrink-0">
                                  {ex.target_sets}×{ex.target_reps}
                                </span>
                              </div>
                            );
                          })}
                          {exercises.length > 3 && (
                            <span className="text-[10px] text-emerald-400 font-bold block pt-0.5">
                              +{exercises.length - 3} ejercicios más...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-1 opacity-60">
                      <Coffee className="w-6 h-6 mb-1 text-slate-400" />
                      <span className="text-xs font-bold">Día de Descanso</span>
                      <p className="text-[10px] opacity-75">Sin entrenamiento programado</p>
                    </div>
                  )}

                  {/* Card Footer Button */}
                  <div className="pt-2 border-t">
                    {hasRoutine ? (
                      <div className="w-full text-xs font-bold text-emerald-400 flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                        <span>Ver / Registrar Serie</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDate(day.dateStr);
                          onOpenPlanBuilder();
                        }}
                        className="w-full text-[11px] font-bold text-foreground/70 hover:text-emerald-400 flex items-center justify-center gap-1 py-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Asignar Rutina</span>
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

