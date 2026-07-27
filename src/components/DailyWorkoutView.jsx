import React, { useState, useEffect } from 'react';
import { 
  Timer, Check, GripVertical, Plus, ArrowUp, ArrowDown, RefreshCw, CalendarX 
} from 'lucide-react';
import { getRoutineForDay, saveSetResult, updateExerciseSortOrder } from '../lib/api';
import { convertWeight } from '../lib/utils';
import RestTimer from './RestTimer';

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

  const handleSetChange = async (routineExId, setNum, key, value) => {
    setSetsState(prev => {
      const currentExSets = prev[routineExId] || {};
      const currentSet = currentExSets[setNum] || {};
      const updatedSet = { ...currentSet, [key]: value };
      
      const newState = {
        ...prev,
        [routineExId]: {
          ...currentExSets,
          [setNum]: updatedSet
        }
      };

      if (key === 'completed' && value === true) {
        saveSingleSetToSupabase(routineExId, dateStr, setNum, updatedSet);
      }

      return newState;
    });
  };

  const toggleUnitForSet = (routineExId, setNum) => {
    setSetsState(prev => {
      const currentSet = prev[routineExId][setNum];
      const newUnit = currentSet.unit === 'kg' ? 'lb' : 'kg';
      const convertedWeight = convertWeight(currentSet.weight, currentSet.unit, newUnit);

      const updatedSet = {
        ...currentSet,
        unit: newUnit,
        weight: convertedWeight
      };

      const newState = {
        ...prev,
        [routineExId]: {
          ...prev[routineExId],
          [setNum]: updatedSet
        }
      };

      persistSetResult(routineExId, dateStr, setNum, updatedSet);
      return newState;
    });
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

  const moveExercise = async (fromIndex, toIndex) => {
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
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e, toIndex) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex)) {
      moveExercise(fromIndex, toIndex);
    }
  };

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
        {exercisesList.map((exItem, exIdx) => {
          const exercise = exItem.exercise || {};
          const numSets = exItem.target_sets || 3;
          const exSets = setsState[exItem.id] || {};

          return (
            <div
              key={exItem.id}
              draggable
              onDragStart={(e) => handleDragStart(e, exIdx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, exIdx)}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 relative transition-all"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-start gap-2.5">
                  <span className="cursor-grab text-slate-500 hover:text-slate-300 p-1 mt-0.5" title="Arrastrar para ordenar">
                    <GripVertical className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-400 bg-slate-800 px-2 py-0.5 rounded-lg">
                        #{exIdx + 1}
                      </span>
                      <h4 className="text-base font-extrabold text-white">{exercise.name}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
                      {exercise.muscle_groups && (
                        <span className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                          💪 {exercise.muscle_groups.join(', ')}
                        </span>
                      )}
                      <span className="bg-slate-950 text-emerald-400 px-2 py-0.5 rounded border border-slate-800 text-[11px] font-semibold">
                        Meta: {exItem.target_sets} sets x {exItem.target_reps} @ RIR {exItem.target_rir} ({exItem.target_weight}{exItem.weight_unit})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTimerSeconds(exItem.target_rest_sec || 90)}
                    className="bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                    title="Iniciar Temporizador de Descanso"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>{exItem.target_rest_sec || 90}s</span>
                  </button>

                  <div className="flex items-center gap-0.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => moveExercise(exIdx, exIdx - 1)}
                      disabled={exIdx === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      title="Subir"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveExercise(exIdx, exIdx + 1)}
                      disabled={exIdx === exercisesList.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      title="Bajar"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800/60">
                      <th className="py-2 px-2">Serie</th>
                      <th className="py-2 px-2">Peso Usado</th>
                      <th className="py-2 px-2">Reps</th>
                      <th className="py-2 px-2">RIR</th>
                      <th className="py-2 px-2 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {Array.from({ length: numSets }, (_, i) => i + 1).map((setNum) => {
                      const setData = exSets[setNum] || {
                        reps: '',
                        weight: exItem.target_weight || '',
                        unit: exItem.weight_unit || 'kg',
                        rir: exItem.target_rir || 2,
                        completed: false
                      };

                      return (
                        <tr 
                          key={setNum}
                          className={`transition-all ${
                            setData.completed ? 'bg-emerald-500/5' : 'hover:bg-slate-800/30'
                          }`}
                        >
                          <td className="py-2 px-2 font-black text-slate-300">
                            SET {setNum}
                          </td>

                          <td className="py-2 px-2">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                step="0.5"
                                placeholder="0"
                                value={setData.weight}
                                onChange={(e) => handleSetChange(exItem.id, setNum, 'weight', e.target.value)}
                                className="w-16 bg-slate-950 text-slate-100 font-bold px-2 py-1 rounded border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => toggleUnitForSet(exItem.id, setNum)}
                                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-[10px] px-1.5 py-1 rounded border border-slate-700 uppercase"
                                title="Cambiar unidad de peso (kg <-> lb)"
                              >
                                {setData.unit}
                              </button>
                            </div>
                          </td>

                          <td className="py-2 px-2">
                            <input
                              type="number"
                              placeholder="Reps"
                              value={setData.reps}
                              onChange={(e) => handleSetChange(exItem.id, setNum, 'reps', e.target.value)}
                              className="w-16 bg-slate-950 text-slate-100 font-bold px-2 py-1 rounded border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs"
                            />
                          </td>

                          <td className="py-2 px-2">
                            <select
                              value={setData.rir}
                              onChange={(e) => handleSetChange(exItem.id, setNum, 'rir', e.target.value)}
                              className="bg-slate-950 text-slate-200 font-medium px-1.5 py-1 rounded border border-slate-800 text-xs focus:outline-none"
                            >
                              <option value="0">RIR 0</option>
                              <option value="1">RIR 1</option>
                              <option value="2">RIR 2</option>
                              <option value="3">RIR 3</option>
                              <option value="4">RIR 4+</option>
                            </select>
                          </td>

                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleSetChange(exItem.id, setNum, 'completed', !setData.completed)}
                              className={`w-7 h-7 rounded-lg border inline-flex items-center justify-center transition-all ${
                                setData.completed
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                              }`}
                            >
                              {setData.completed && <Check className="w-4 h-4 stroke-[3]" />}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          );
        })}
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
