import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Check, Plus, RefreshCw, CalendarX } from 'lucide-react';
import { getRoutineForDay, saveSetResult, updateExerciseSortOrder } from '../lib/api';
import { convertWeight } from '../lib/utils';
import RestTimer from './RestTimer';
import ExerciseCard from './ExerciseCard';

export default function DailyWorkoutView({ 
  clientId, 
  dateStr, 
  onOpenPlanBuilder 
}) {
  const [loading, setLoading] = useState(true);
  const [routineData, setRoutineData] = useState(null);
  const [exercisesList, setExercisesList] = useState([]);
  const [setsState, setSetsState] = useState({});
  const [activeTimerSeconds, setActiveTimerSeconds] = useState(null);

  useEffect(() => {
    if (clientId && dateStr) {
      loadDayWorkout();
    }
  }, [clientId, dateStr]);

  const loadDayWorkout = async () => {
    try {
      setLoading(true);
      const data = await getRoutineForDay(clientId, dateStr);
      if (data) {
        setRoutineData(data.routine);
        setExercisesList(data.exercises || []);

        const initialSets = {};
        (data.exercises || []).forEach(ex => {
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
        setRoutineData(null);
        setExercisesList([]);
        setSetsState({});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const persistSetResult = async (routineExId, date, setNum, setData) => {
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
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetChange = useCallback((routineExId, setNum, key, value) => {
    let updatedSet = null;

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

  const toggleUnitForSet = useCallback((routineExId, setNum) => {
    let updatedSet = null;

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

  const moveExercise = useCallback(async (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= exercisesList.length) return;
    const newList = [...exercisesList];
    const moved = newList.splice(fromIndex, 1)[0];
    newList.splice(toIndex, 0, moved);

    setExercisesList(newList);

    if (routineData) {
      try {
        await updateExerciseSortOrder(routineData.id, newList);
      } catch (e) {
        console.error(e);
      }
    }
  }, [exercisesList, routineData]);

  const handleDragStart = useCallback((e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleDrop = useCallback((e, toIndex) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex)) {
      moveExercise(fromIndex, toIndex);
    }
  }, [moveExercise]);

  const handleStartRestTimer = useCallback((seconds) => {
    setActiveTimerSeconds(seconds);
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
        Cargando entrenamiento...
      </div>
    );
  }

  if (!routineData || exercisesList.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 text-center my-4">
        <CalendarX className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Sin Rutina Programada para Hoy</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
          No hay ejercicios asignados para esta fecha. Crea o asigna un plan de entrenamiento.
        </p>
        <button
          onClick={onOpenPlanBuilder}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Crear Plan Replicado
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              Rutina del Día
            </span>
            {routineData.muscle_groups && routineData.muscle_groups.length > 0 && (
              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-medium">
                {routineData.muscle_groups.join(', ')}
              </span>
            )}
          </div>
          <h3 className="text-lg font-black text-white mt-1">
            {routineData.routine_name}
          </h3>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>{exercisesList.length} Ejercicio{exercisesList.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

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
