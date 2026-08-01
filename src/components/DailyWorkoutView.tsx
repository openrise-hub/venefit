import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Chip, Button } from '@heroui/react';
import { Plus, RefreshCw, CalendarX } from 'lucide-react';
import { saveSetResult, updateExerciseSortOrder } from '../lib/api';
import { useRoutineForDay } from '../lib/useWorkoutData';
import { convertWeight } from '../lib/utils';
import RestTimer from './RestTimer';
import ExerciseCard from './ExerciseCard';

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

  useEffect(() => {
    if (fetchedExercises && fetchedExercises.length > 0) {
      setExercisesList(fetchedExercises);

      const initialSets: Record<string, any> = {};
      fetchedExercises.forEach((ex: any) => {
        initialSets[ex.id] = {};
        const numSets = ex.target_sets || 3;
        for (let s = 1; s <= numSets; s++) {
          const existing = ex.setResults ? ex.setResults[s] : null;
          initialSets[ex.id][s] = {
            reps: existing ? existing.completed_reps : '',
            weight: existing ? existing.weight_used : (ex.target_weight || ''),
            unit: existing ? existing.weight_unit : (ex.weight_unit || 'kg'),
            rir: existing ? existing.actual_rir : (ex.target_rir || 2),
            completed: existing ? existing.completed : false
          };
        }
      });
      setSetsState(initialSets);
    } else {
      setExercisesList([]);
      setSetsState({});
    }
  }, [fetchedExercises]);

  const persistSetResult = async (routineExId: string, date: string, setNum: number, setData: any) => {
    try {
      await saveSetResult({
        routine_exercise_id: routineExId,
        date,
        set_number: setNum,
        completed_reps: setData.reps,
        weight_used: setData.weight,
        weight_unit: setData.unit,
        actual_rir: setData.rir,
        completed: setData.completed
      });
      mutate();
    } catch (e) {
      console.error(e);
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
      const currentSet = prev[routineExId][setNum];
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

    if (updatedSet) {
      persistSetResult(routineExId, dateStr, setNum, updatedSet);
    }
  }, [dateStr]);

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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
          Cargando entrenamiento...
        </CardContent>
      </Card>
    );
  }

  if (!routineData || exercisesList.length === 0) {
    return (
      <Card className="my-4">
        <CardContent className="p-8 text-center">
          <CalendarX className="w-12 h-12 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold mb-1">Sin Rutina Programada para Hoy</h3>
          <p className="text-xs max-w-sm mx-auto mb-4 opacity-70">
            No hay ejercicios asignados para esta fecha. Crea o asigna un plan de entrenamiento.
          </p>
          <Button
            variant="primary"
            size="sm"
            onPress={onOpenPlanBuilder}
          >
            <Plus />
            <span>Crear Plan Replicado</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Chip size="sm" variant="soft">
                Rutina del Día
              </Chip>
              {routineData.muscle_groups && routineData.muscle_groups.length > 0 && (
                <Chip size="sm" variant="soft">
                  {routineData.muscle_groups.join(', ')}
                </Chip>
              )}
            </div>
            <h3 className="text-lg font-black mt-1">
              {routineData.routine_name}
            </h3>
          </div>

          <div className="text-xs opacity-70">
            {exercisesList.length} Ejercicio{exercisesList.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {exercisesList.map((exItem, exIdx) => (
          <ExerciseCard
            key={exItem.id}
            exItem={exItem}
            exIdx={exIdx}
            exSets={setsState[exItem.id] || {}}
            totalExercises={exercisesList.length}
            onSetChange={handleSetChange}
            onToggleUnit={toggleUnitForSet}
            onStartRestTimer={handleStartRestTimer}
            onMoveExercise={moveExercise}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
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
