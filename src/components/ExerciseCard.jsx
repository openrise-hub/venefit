import React, { memo } from 'react';
import { Card, CardContent, Chip, Button, Input } from '@heroui/react';
import { GripVertical, Timer, ArrowUp, ArrowDown, Check } from 'lucide-react';

const RIR_OPTIONS = [
  { key: '0', label: 'RIR 0 (Fallo)' },
  { key: '1', label: 'RIR 1' },
  { key: '2', label: 'RIR 2' },
  { key: '3', label: 'RIR 3' },
  { key: '4', label: 'RIR 4+' }
];

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
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, exIdx)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, exIdx)}
      className="bg-slate-900 border border-slate-800/80 shadow-xl transition-all"
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-start gap-2.5">
            <span className="cursor-grab text-slate-500 hover:text-slate-300 p-1 mt-0.5" title="Arrastrar para ordenar">
              <GripVertical className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <Chip color="success" variant="flat" size="sm" className="font-extrabold text-xs">
                  #{exIdx + 1}
                </Chip>
                <h4 className="text-base font-extrabold text-white">{exercise.name}</h4>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {exercise.muscle_groups && (
                  <Chip size="sm" variant="bordered" className="border-slate-800 text-slate-300 text-[11px]">
                    💪 {exercise.muscle_groups.join(', ')}
                  </Chip>
                )}
                <Chip size="sm" color="success" variant="bordered" className="text-[11px] font-semibold">
                  Meta: {exItem.target_sets} sets x {exItem.target_reps} @ RIR {exItem.target_rir} ({exItem.target_weight}{exItem.weight_unit})
                </Chip>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              color="success"
              variant="flat"
              onPress={() => onStartRestTimer(exItem.target_rest_sec || 90)}
              startContent={<Timer className="w-3.5 h-3.5" />}
              className="font-bold text-xs"
            >
              {exItem.target_rest_sec || 90}s
            </Button>

            <div className="flex items-center gap-0.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                isDisabled={exIdx === 0}
                onPress={() => onMoveExercise(exIdx, exIdx - 1)}
                className="text-slate-400 hover:text-white min-w-6 w-6 h-6"
                title="Subir"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                isDisabled={exIdx === totalExercises - 1}
                onPress={() => onMoveExercise(exIdx, exIdx + 1)}
                className="text-slate-400 hover:text-white min-w-6 w-6 h-6"
                title="Bajar"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
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
                        <Input
                          type="number"
                          step="0.5"
                          placeholder="0"
                          size="sm"
                          value={String(setData.weight)}
                          onChange={(e) => onSetChange(exItem.id, setNum, 'weight', e.target.value)}
                          className="w-20"
                          aria-label="Peso usado"
                        />
                        <Button
                          size="sm"
                          variant="flat"
                          color="success"
                          onPress={() => onToggleUnit(exItem.id, setNum)}
                          className="min-w-8 px-1.5 h-8 font-bold text-[10px] uppercase"
                          title="Cambiar unidad de peso (kg <-> lb)"
                        >
                          {setData.unit}
                        </Button>
                      </div>
                    </td>

                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        placeholder="Reps"
                        size="sm"
                        value={String(setData.reps)}
                        onChange={(e) => onSetChange(exItem.id, setNum, 'reps', e.target.value)}
                        className="w-16"
                        aria-label="Repeticiones logradas"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <select
                        value={String(setData.rir)}
                        onChange={(e) => onSetChange(exItem.id, setNum, 'rir', e.target.value)}
                        className="bg-slate-950 text-slate-200 font-medium px-2 py-1.5 rounded-xl border border-slate-800 text-xs focus:outline-none"
                      >
                        {RIR_OPTIONS.map(opt => (
                          <option key={opt.key} value={opt.key}>{opt.label}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-2 px-2 text-center">
                      <Button
                        isIconOnly
                        size="sm"
                        color={setData.completed ? "success" : "default"}
                        variant={setData.completed ? "solid" : "bordered"}
                        onPress={() => onSetChange(exItem.id, setNum, 'completed', !setData.completed)}
                        className="min-w-8 w-8 h-8 rounded-lg"
                        title={setData.completed ? "Serie completada" : "Marcar serie completada"}
                      >
                        {setData.completed ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(ExerciseCard);
