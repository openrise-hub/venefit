import React, { memo } from 'react';
import { GripVertical, Timer, ArrowUp, ArrowDown, Check } from 'lucide-react';

function ExerciseCard({
  exItem,
  exIdx,
  exSets,
  totalExercises,
  onSetChange,
  onToggleUnit,
  onStartRestTimer,
  onMoveExercise,
  onDragStart,
  onDrop
}) {
  const exercise = exItem.exercise || {};
  const numSets = exItem.target_sets || 3;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, exIdx)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, exIdx)}
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
            onClick={() => onStartRestTimer(exItem.target_rest_sec || 90)}
            className="bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
            title="Iniciar Temporizador de Descanso"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>{exItem.target_rest_sec || 90}s</span>
          </button>

          <div className="flex items-center gap-0.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onMoveExercise(exIdx, exIdx - 1)}
              disabled={exIdx === 0}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
              title="Subir"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onMoveExercise(exIdx, exIdx + 1)}
              disabled={exIdx === totalExercises - 1}
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
                        onChange={(e) => onSetChange(exItem.id, setNum, 'weight', e.target.value)}
                        className="w-16 bg-slate-950 text-slate-100 font-bold px-2 py-1 rounded border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => onToggleUnit(exItem.id, setNum)}
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
                      onChange={(e) => onSetChange(exItem.id, setNum, 'reps', e.target.value)}
                      className="w-16 bg-slate-950 text-slate-100 font-bold px-2 py-1 rounded border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs"
                    />
                  </td>

                  <td className="py-2 px-2">
                    <select
                      value={setData.rir}
                      onChange={(e) => onSetChange(exItem.id, setNum, 'rir', e.target.value)}
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
                      onClick={() => onSetChange(exItem.id, setNum, 'completed', !setData.completed)}
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
}

export default memo(ExerciseCard);
