import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, Chip, Button } from '@heroui/react';
import { Plus, RefreshCw, CalendarX } from 'lucide-react';
import { saveSetResult, updateExerciseSortOrder, updateRoutineExercise, addExerciseToRoutine, deleteRoutineExercise } from '../lib/api';
import { useRoutineForDay } from '../lib/useWorkoutData';
import { convertWeight } from '../lib/utils';
import RestTimer from './RestTimer';
import ExerciseCard from './ExerciseCard';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import { RoutineExercise } from '../types';

interface DailyWorkoutViewProps {
  clientId: string;
  dateStr: string;
  onOpenPlanBuilder: () => void;
}

export default function DailyWorkoutView({ 
  clientId, 
  dateStr, 
  onOpenPlanBuilder 
}: DailyWorkoutViewProps) {
  const { routineData, exercisesList: fetchedExercises, isLoading, mutate } = useRoutineForDay(clientId, dateStr);
  const [exercisesList, setExercisesList] = useState<any[]>([]);
  const [setsState, setSetsState] = useState<Record<string, any>>({});
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number | null>(null);
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);

  // Keep track of the last processed routine and exercises signature to avoid infinite render loops
  const lastSyncSignatureRef = useRef<string>('');
  const setsStateRef = useRef<Record<string, any>>({});
  const debounceTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Clean up debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach(t => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (fetchedExercises && fetchedExercises.length > 0) {
      // Build a signature of the current exercises to see if they genuinely changed
      const currentSignature = `${dateStr}_${routineData?.id || ''}_${fetchedExercises.map(e => `${e.id}_${e.target_sets}_${e.target_weight}_${e.target_reps}_${e.target_rir}`).join('|')}`;
      
      if (lastSyncSignatureRef.current !== currentSignature) {
        lastSyncSignatureRef.current = currentSignature;
        setExercisesList(fetchedExercises);

        setSetsState(prevSets => {
          const newSets: Record<string, any> = { ...prevSets };
          fetchedExercises.forEach((ex: any) => {
            if (!newSets[ex.id]) {
              newSets[ex.id] = {};
            }
            const numSets = ex.target_sets || 3;
            for (let s = 1; s <= numSets; s++) {
              const existing = ex.setResults ? ex.setResults[s] : null;
              // If user has typed something locally, preserve it; otherwise use fetched/default
              if (!newSets[ex.id][s]) {
                newSets[ex.id][s] = {
                  reps: existing ? existing.completed_reps : '',
                  weight: existing ? existing.weight_used : (ex.target_weight || ''),
                  unit: existing ? existing.weight_unit : (ex.weight_unit || 'kg'),
                  rir: existing ? existing.actual_rir : (ex.target_rir ?? 2),
                  set_type: existing ? existing.set_type : (ex.technique === 'dropset' && s === numSets ? 'dropset' : 'normal'),
                  completed: existing ? existing.completed : false
                };
              }
            }
          });
          setsStateRef.current = newSets;
          return newSets;
        });
      }
    } else if (!isLoading && fetchedExercises && fetchedExercises.length === 0) {
      if (lastSyncSignatureRef.current !== 'empty') {
        lastSyncSignatureRef.current = 'empty';
        setExercisesList([]);
        setSetsState({});
        setsStateRef.current = {};
      }
    }
  }, [fetchedExercises, routineData, isLoading, dateStr]);

  const persistSetResult = useCallback(async (routineExId: string, date: string, setNum: number, setData: any) => {
    if (!setData) return;
    try {
      await saveSetResult({
        routine_exercise_id: routineExId,
        date,
        set_number: setNum,
        set_type: setData.set_type || 'normal',
        completed_reps: setData.reps,
        weight_used: setData.weight,
        weight_unit: setData.unit,
        actual_rir: setData.rir,
        completed: setData.completed === true
      });
      mutate();
    } catch (e) {
      console.error('[DailyWorkoutView:persistSetResult]', e);
    }
  }, [mutate]);

  const handleSetChange = useCallback((routineExId: string, setNum: number, key: string, value: any) => {
    let updatedSet: any = null;

    setSetsState(prev => {
      const currentExSets = prev[routineExId] || {};
      const currentSet = currentExSets[setNum] || {};
      updatedSet = { ...currentSet, [key]: value };

      const next = {
        ...prev,
        [routineExId]: {
          ...currentExSets,
          [setNum]: updatedSet
        }
      };
      setsStateRef.current = next;
      return next;
    });

    const timerKey = `${routineExId}_${setNum}`;

    // 1) Completion toggle (true OR false): save immediately and clear pending debounce
    if (key === 'completed') {
      if (debounceTimersRef.current[timerKey]) {
        clearTimeout(debounceTimersRef.current[timerKey]);
        delete debounceTimersRef.current[timerKey];
      }
      if (updatedSet) {
        persistSetResult(routineExId, dateStr, setNum, updatedSet);
      }
      return;
    }

    // 2) Discrete RIR change: save immediately and clear pending debounce
    if (key === 'rir') {
      if (debounceTimersRef.current[timerKey]) {
        clearTimeout(debounceTimersRef.current[timerKey]);
        delete debounceTimersRef.current[timerKey];
      }
      if (updatedSet) {
        persistSetResult(routineExId, dateStr, setNum, updatedSet);
      }
      return;
    }

    // 3) Typing weight or reps: debounce auto-save so user edits persist even without blur
    if (key === 'weight' || key === 'reps') {
      if (debounceTimersRef.current[timerKey]) {
        clearTimeout(debounceTimersRef.current[timerKey]);
      }
      debounceTimersRef.current[timerKey] = setTimeout(() => {
        const latestSet = setsStateRef.current[routineExId]?.[setNum];
        if (latestSet) {
          persistSetResult(routineExId, dateStr, setNum, latestSet);
        }
        delete debounceTimersRef.current[timerKey];
      }, 750);
    }
  }, [dateStr, persistSetResult]);

  const handleSetBlur = useCallback((routineExId: string, setNum: number) => {
    const timerKey = `${routineExId}_${setNum}`;
    if (debounceTimersRef.current[timerKey]) {
      clearTimeout(debounceTimersRef.current[timerKey]);
      delete debounceTimersRef.current[timerKey];
    }
    const currentSet = setsStateRef.current[routineExId]?.[setNum];
    if (currentSet) {
      persistSetResult(routineExId, dateStr, setNum, currentSet);
    }
  }, [dateStr, persistSetResult]);

  const toggleUnitForSet = useCallback((routineExId: string, setNum: number) => {
    let updatedSet: any = null;

    setSetsState(prev => {
      const currentSet = prev[routineExId]?.[setNum];
      if (!currentSet) return prev;
      const newUnit = currentSet.unit === 'kg' ? 'lb' : 'kg';
      const convertedWeight = convertWeight(currentSet.weight, currentSet.unit, newUnit);

      updatedSet = {
        ...currentSet,
        unit: newUnit,
        weight: convertedWeight
      };

      const next = {
        ...prev,
        [routineExId]: {
          ...prev[routineExId],
          [setNum]: updatedSet
        }
      };
      setsStateRef.current = next;
      return next;
    });

    const timerKey = `${routineExId}_${setNum}`;
    if (debounceTimersRef.current[timerKey]) {
      clearTimeout(debounceTimersRef.current[timerKey]);
      delete debounceTimersRef.current[timerKey];
    }

    if (updatedSet) {
      persistSetResult(routineExId, dateStr, setNum, updatedSet);
    }
  }, [dateStr, persistSetResult]);

  const handleUpdateExerciseTarget = useCallback(async (routineExId: string, updates: Partial<RoutineExercise>) => {
    await updateRoutineExercise(routineExId, updates);
    lastSyncSignatureRef.current = ''; // Force re-sync
    mutate();
  }, [mutate]);

  const moveExercise = useCallback(async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= exercisesList.length) return;
    const newList = [...exercisesList];
    const moved = newList.splice(fromIndex, 1)[0];
    newList.splice(toIndex, 0, moved);

    setExercisesList(newList);

      if (routineData) {
        try {
          await updateExerciseSortOrder(routineData.id, newList);
          mutate();
        } catch (e) {
          console.error(e);
        }
      }
    },
    [exercisesList, routineData, mutate]
  );

  const handleAddExercisesToRoutine = useCallback(
    async (selectedExercises: any[]) => {
      if (!routineData || selectedExercises.length === 0) return;
      try {
        for (const ex of selectedExercises) {
          await addExerciseToRoutine(routineData.id, ex.id);
        }
        lastSyncSignatureRef.current = '';
        mutate();
      } catch (err) {
        console.error('[DailyWorkoutView:handleAddExercises]', err);
      }
    },
    [routineData, mutate]
  );

  const handleRemoveExercise = useCallback(
    async (routineExId: string) => {
      try {
        await deleteRoutineExercise(routineExId);
        lastSyncSignatureRef.current = '';
        mutate();
      } catch (err) {
        console.error('[DailyWorkoutView:handleRemoveExercise]', err);
      }
    },
    [mutate]
  );

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex)) {
      moveExercise(fromIndex, toIndex);
    }
  }, [moveExercise]);

  const handleStartRestTimer = useCallback((seconds: number) => {
    setActiveTimerSeconds(seconds);
  }, []);

  // Compute group sub-indexes (e.g. A1, A2, B1...)
  const exerciseGroupLabels = useMemo(() => {
    const groupCounters: Record<string, number> = {};
    const labels: Record<string, string> = {};

    exercisesList.forEach((ex) => {
      if (ex.group_tag) {
        const tag = ex.group_tag.toUpperCase();
        groupCounters[tag] = (groupCounters[tag] || 0) + 1;
        labels[ex.id] = `${tag}${groupCounters[tag]}`;
      }
    });

    return labels;
  }, [exercisesList]);

  if (isLoading && exercisesList.length === 0) {
    return (
      <Card className="border border-border">
        <CardContent className="p-8 text-center text-xs" role="status" aria-live="polite">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" aria-hidden="true" />
          <span className="text-muted font-medium">Cargando entrenamiento…</span>
        </CardContent>
      </Card>
    );
  }

  if (!routineData || exercisesList.length === 0) {
    return (
      <Card className="my-4 border border-border shadow-xs">
        <CardContent className="p-8 text-center">
          <CalendarX className="w-12 h-12 mx-auto mb-3 text-emerald-400/80" aria-hidden="true" />
          <h3 className="text-base font-bold mb-1 text-foreground">Sin Rutina Programada para Hoy</h3>
          <p className="text-xs max-w-sm mx-auto mb-4 text-muted leading-relaxed">
            No hay ejercicios asignados para esta fecha. Crea o asigna un plan de entrenamiento replicado.
          </p>
          <Button
            variant="primary"
            size="sm"
            onPress={onOpenPlanBuilder}
            aria-label="Crear plan de entrenamiento replicado"
            className="font-bold shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
            <span>Crear Plan Replicado</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Routine Header Card */}
      <Card className="border border-border shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Chip size="sm" variant="soft" className="font-semibold text-emerald-400 border border-emerald-500/30">
                Rutina del Día
              </Chip>
              {routineData.muscle_groups && routineData.muscle_groups.length > 0 && (
                <Chip size="sm" variant="soft" className="text-muted">
                  {routineData.muscle_groups.join(', ')}
                </Chip>
              )}
            </div>
            <h3 className="text-lg font-black mt-1 font-heading text-foreground">
              {routineData.routine_name}
            </h3>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-muted font-bold tabular-nums">
              {exercisesList.length}&nbsp;Ejercicio{exercisesList.length !== 1 ? 's' : ''}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2.5 text-xs font-bold text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              onPress={() => setIsExerciseSelectorOpen(true)}
              aria-label="Agregar ejercicio a esta rutina"
            >
              <Plus className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              <span>Agregar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercises List */}
      <div className="space-y-4">
        {exercisesList.map((exItem, exIdx) => (
          <ExerciseCard
            key={exItem.id}
            exItem={exItem}
            exIdx={exIdx}
            exSets={setsState[exItem.id] || {}}
            totalExercises={exercisesList.length}
            groupLabel={exerciseGroupLabels[exItem.id]}
            onSetChange={handleSetChange}
            onSetBlur={handleSetBlur}
            onToggleUnit={toggleUnitForSet}
            onStartRestTimer={handleStartRestTimer}
            onMoveExercise={moveExercise}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onUpdateTarget={handleUpdateExerciseTarget}
            onRemoveExercise={handleRemoveExercise}
          />
        ))}

        {/* Add Exercise on the Fly Button */}
        <Button
          variant="outline"
          onPress={() => setIsExerciseSelectorOpen(true)}
          className="w-full h-11 border-dashed border-2 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5 text-emerald-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 rounded-2xl transition-all cursor-pointer"
          aria-label="Agregar ejercicio a la rutina de hoy"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Agregar Ejercicio a esta rutina</span>
        </Button>
      </div>

      {isExerciseSelectorOpen && (
        <ExerciseSelectorModal
          isOpen={isExerciseSelectorOpen}
          onClose={() => setIsExerciseSelectorOpen(false)}
          onAddExercises={handleAddExercisesToRoutine}
        />
      )}

      {activeTimerSeconds && (
        <RestTimer
          initialSeconds={activeTimerSeconds}
          onClose={() => setActiveTimerSeconds(null)}
        />
      )}
    </div>
  );
}
