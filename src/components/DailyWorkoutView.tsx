import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, Chip, Button } from '@heroui/react';
import { Plus, RefreshCw, CalendarX } from 'lucide-react';
import { saveSetResult, updateExerciseSortOrder, updateRoutineExercise } from '../lib/api';
import { useRoutineForDay } from '../lib/useWorkoutData';
import { convertWeight } from '../lib/utils';
import RestTimer from './RestTimer';
import ExerciseCard from './ExerciseCard';
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

  // Keep track of the last processed routine and exercises signature to avoid infinite render loops
  const lastSyncSignatureRef = useRef<string>('');

  useEffect(() => {
    if (fetchedExercises && fetchedExercises.length > 0) {
      // Build a signature of the current exercises to see if they genuinely changed
      const currentSignature = `${routineData?.id || ''}_${fetchedExercises.map(e => `${e.id}_${e.target_sets}_${e.target_weight}_${e.target_reps}_${e.target_rir}`).join('|')}`;
      
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
          return newSets;
        });
      }
    } else if (!isLoading && fetchedExercises && fetchedExercises.length === 0) {
      if (lastSyncSignatureRef.current !== 'empty') {
        lastSyncSignatureRef.current = 'empty';
        setExercisesList([]);
        setSetsState({});
      }
    }
  }, [fetchedExercises, routineData, isLoading]);

  const persistSetResult = async (routineExId: string, date: string, setNum: number, setData: any) => {
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
        completed: setData.completed
      });
      mutate();
    } catch (e) {
      console.error('[DailyWorkoutView:persistSetResult]', e);
    }
  };

  const handleSetChange = useCallback((routineExId: string, setNum: number, key: string, value: any) => {
    let updatedSet: any = null;

    setSetsState(prev => {
      const currentExSets = prev[routineExId] || {};
      const currentSet = currentExSets[setNum] || {};
      updatedSet = { ...currentSet, [key]: value };

      return {
        ...prev,
        [routineExId]: {
          ...currentExSets,
          [setNum]: updatedSet
        }
      };
    });

    if (key === 'completed' && value === true && updatedSet) {
      persistSetResult(routineExId, dateStr, setNum, updatedSet);
    }
  }, [dateStr]);

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

      return {
        ...prev,
        [routineExId]: {
          ...prev[routineExId],
          [setNum]: updatedSet
        }
      };
    });

    if (updatedSet && updatedSet.completed) {
      persistSetResult(routineExId, dateStr, setNum, updatedSet);
    }
  }, [dateStr]);

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
  }, [exercisesList, routineData, mutate]);

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
      <Card>
        <CardContent className="p-8 text-center text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
          Cargando entrenamiento...
        </CardContent>
      </Card>
    );
  }

  if (!routineData || exercisesList.length === 0) {
    return (
      <Card className="my-4">
        <CardContent className="p-8 text-center">
          <CalendarX className="w-12 h-12 mx-auto mb-3 opacity-60 text-emerald-400" />
          <h3 className="text-base font-bold mb-1">Sin Rutina Programada para Hoy</h3>
          <p className="text-xs max-w-sm mx-auto mb-4 opacity-70">
            No hay ejercicios asignados para esta fecha. Crea o asigna un plan de entrenamiento.
          </p>
          <Button
            variant="primary"
            size="sm"
            onPress={onOpenPlanBuilder}
            className="font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Crear Plan Replicado</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Routine Header Card */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Chip size="sm" variant="soft" className="font-semibold text-emerald-400">
                Rutina del Día
              </Chip>
              {routineData.muscle_groups && routineData.muscle_groups.length > 0 && (
                <Chip size="sm" variant="soft">
                  {routineData.muscle_groups.join(', ')}
                </Chip>
              )}
            </div>
            <h3 className="text-lg font-black mt-1 font-heading">
              {routineData.routine_name}
            </h3>
          </div>

          <div className="text-xs opacity-75 font-bold">
            {exercisesList.length} Ejercicio{exercisesList.length !== 1 ? 's' : ''}
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
            onToggleUnit={toggleUnitForSet}
            onStartRestTimer={handleStartRestTimer}
            onMoveExercise={moveExercise}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onUpdateTarget={handleUpdateExerciseTarget}
          />
        ))}
      </div>

      {activeTimerSeconds && (
        <RestTimer
          initialSeconds={activeTimerSeconds}
          onClose={() => setActiveTimerSeconds(null)}
        />
      )}
    </div>
  );
}
