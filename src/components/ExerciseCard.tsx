import React, { memo } from 'react';
import { Card, CardContent, Chip, Button, Input } from '@heroui/react';
import { GripVertical, Timer, ArrowUp, ArrowDown, Check, Info } from 'lucide-react';
import { RoutineExercise, ExerciseSetResult } from '../types';

const RIR_OPTIONS = [
  { key: '0', label: 'RIR 0 (Fallo)' },
  { key: '1', label: 'RIR 1' },
  { key: '2', label: 'RIR 2' },
  { key: '3', label: 'RIR 3' },
  { key: '4', label: 'RIR 4+' }
];

const TECHNIQUE_LABELS: Record<string, string> = {
  straight: 'Serie Normal',
  superset: 'Superserie',
  multiseries: 'Multiserie',
  dropset: 'Drop Set',
  rest_pause: 'Rest-Pause',
  myo_reps: 'Myo-Reps',
  top_backoff: 'Top Set / Back-off'
};

interface ExerciseCardProps {
  exItem: RoutineExercise;
  exIdx: number;
  exSets: Record<number, ExerciseSetResult>;
  totalExercises: number;
  groupLabel?: string;
  onSetChange: (routineExId: string, setNum: number, key: string, value: any) => void;
  onToggleUnit: (routineExId: string, setNum: number) => void;
  onStartRestTimer: (seconds: number) => void;
  onMoveExercise: (fromIndex: number, toIndex: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, toIndex: number) => void;
}

function ExerciseCard({
  exItem,
  exIdx,
  exSets,
  totalExercises,
  groupLabel,
  onSetChange,
  onToggleUnit,
  onStartRestTimer,
  onMoveExercise,
  onDragStart,
  onDrop
}: ExerciseCardProps) {
  const exercise = exItem.expandedExercise || (typeof exItem.exercise === 'object' ? exItem.exercise : null) || { name: 'Ejercicio', muscle_groups: [] };
  const muscleGroups = exercise.muscle_groups || [];
  const primaryMuscle = exercise.primary_muscle || (muscleGroups.length > 0 ? muscleGroups[0] : null);
  const modality = exercise.modality || null;
  const numSets = exItem.target_sets || 3;
  const technique = exItem.technique || 'straight';
  const isSpecialTechnique = technique !== 'straight';

  return (
    <Card
      draggable
      onDragStart={(e: any) => onDragStart(e, exIdx)}
      onDragOver={(e: any) => e.preventDefault()}
      onDrop={(e: any) => onDrop(e, exIdx)}
      className={`transition-all ${groupLabel ? 'border-l-4 border-l-emerald-400 shadow-sm' : ''}`}
    >
      <CardContent className="p-3 sm:p-4 space-y-3">
        <div className="flex items-start justify-between gap-2 border-b pb-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <span className="cursor-grab opacity-60 hover:opacity-100 p-1 mt-0.5 shrink-0">
              <GripVertical className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Chip variant="soft" size="sm" className="font-bold">
                  #{exIdx + 1}
                </Chip>
                {groupLabel && (
                  <Chip size="sm" variant="primary" className="font-bold text-[11px] tracking-wider uppercase">
                    {technique === 'superset' ? `Super-Serie ${groupLabel}` : technique === 'multiseries' ? `Multiserie ${groupLabel}` : `Bloque ${groupLabel}`}
                  </Chip>
                )}
                {isSpecialTechnique && !groupLabel && (
                  <Chip size="sm" variant="soft" className="font-bold text-[11px] text-emerald-400">
                    {TECHNIQUE_LABELS[technique] || technique}
                  </Chip>
                )}
                <h4 className="text-sm sm:text-base font-bold truncate">{exercise.name}</h4>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {primaryMuscle && (
                  <Chip size="sm" variant="soft" className="text-[10px] font-semibold">
                    {primaryMuscle}
                  </Chip>
                )}
                {modality && (
                  <Chip size="sm" variant="soft" className="text-[10px] opacity-80">
                    {modality}
                  </Chip>
                )}
                <Chip size="sm" variant="soft" className="text-[10px]">
                  Meta: {exItem.target_sets} sets x {exItem.target_reps} @ RIR {exItem.target_rir} ({exItem.target_weight}{exItem.weight_unit})
                </Chip>
              </div>

              {exItem.notes && (
                <div className="flex items-center gap-1.5 text-[11px] text-foreground/80 mt-2 bg-foreground/5 p-1.5 rounded-lg border">
                  <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{exItem.notes}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onPress={() => onStartRestTimer(exItem.target_rest_sec || 90)}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{exItem.target_rest_sec || 90}s</span>
            </Button>

            <div className="flex items-center gap-0.5 p-0.5 rounded-xl border">
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                isDisabled={exIdx === 0}
                onPress={() => onMoveExercise(exIdx, exIdx - 1)}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                isDisabled={exIdx === totalExercises - 1}
                onPress={() => onMoveExercise(exIdx, exIdx + 1)}
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase border-b opacity-70">
                <th className="py-2 px-1.5">Serie</th>
                <th className="py-2 px-1.5 min-w-[120px]">Peso Usado</th>
                <th className="py-2 px-1.5 min-w-[80px]">Reps</th>
                <th className="py-2 px-1.5 min-w-[90px]">RIR</th>
                <th className="py-2 px-1.5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Array.from({ length: numSets }, (_, i) => i + 1).map((setNum) => {
                const rawSet = exSets[setNum];
                const weightVal = rawSet ? (rawSet.weight ?? rawSet.weight_used ?? exItem.target_weight ?? 0) : (exItem.target_weight ?? 0);
                const repsVal = rawSet ? (rawSet.reps ?? rawSet.completed_reps ?? 0) : 0;
                const unitVal = rawSet ? (rawSet.unit ?? rawSet.weight_unit ?? exItem.weight_unit ?? 'kg') : (exItem.weight_unit ?? 'kg');
                const rirVal = rawSet ? (rawSet.actual_rir ?? rawSet.rir ?? exItem.target_rir ?? 2) : (exItem.target_rir ?? 2);
                const isCompleted = rawSet ? rawSet.completed : false;

                const isLastSet = setNum === numSets;
                const isDropSetItem = technique === 'dropset' && isLastSet;

                return (
                  <tr key={setNum} className={isDropSetItem ? 'bg-emerald-500/5' : ''}>
                    <td className="py-2 px-1.5 font-bold">
                      <div className="flex items-center gap-1.5">
                        <span>SET {setNum}</span>
                        {isDropSetItem && (
                          <Chip size="sm" variant="soft" className="text-[9px] font-bold text-emerald-400">
                            DROP
                          </Chip>
                        )}
                      </div>
                    </td>

                    <td className="py-2 px-1.5">
                      <div className="flex items-center gap-1.5">
                        <Input
                          type="number"
                          step={0.5}
                          placeholder="0"
                          value={Number(weightVal) || undefined}
                          onChange={(e) => onSetChange(exItem.id, setNum, 'weight', e.target.value)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onPress={() => onToggleUnit(exItem.id, setNum)}
                        >
                          {unitVal}
                        </Button>
                      </div>
                    </td>

                    <td className="py-2 px-1.5">
                      <Input
                        type="number"
                        placeholder="Reps"
                        value={Number(repsVal) || undefined}
                        onChange={(e) => onSetChange(exItem.id, setNum, 'reps', e.target.value)}
                      />
                    </td>

                    <td className="py-2 px-1.5">
                      <select
                        value={String(rirVal)}
                        onChange={(e) => onSetChange(exItem.id, setNum, 'rir', e.target.value)}
                        className="w-full h-9 rounded-xl border px-2 text-xs focus:outline-none bg-transparent"
                      >
                        {RIR_OPTIONS.map(opt => (
                          <option key={opt.key} value={opt.key}>{opt.label}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-2 px-1.5 text-center">
                      <Button
                        isIconOnly
                        size="sm"
                        variant={isCompleted ? "primary" : "outline"}
                        onPress={() => onSetChange(exItem.id, setNum, 'completed', !isCompleted)}
                      >
                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : null}
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
