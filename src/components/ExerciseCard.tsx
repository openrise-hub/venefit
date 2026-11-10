import React, { memo, useState } from 'react';
import { Card, CardContent, Chip, Button } from '@heroui/react';
import { GripVertical, Timer, ArrowUp, ArrowDown, Check, Info, Edit3, Target } from 'lucide-react';
import { RoutineExercise, ExerciseSetResult } from '../types';
import EditExerciseTargetModal from './EditExerciseTargetModal';

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
  onUpdateTarget?: (routineExId: string, updates: Partial<RoutineExercise>) => Promise<void>;
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
  onDrop,
  onUpdateTarget
}: ExerciseCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const exercise =
    exItem.expandedExercise ||
    (typeof exItem.exercise === 'object' ? (exItem.exercise as any) : null) ||
    { name: 'Ejercicio', muscle_groups: [] };

  const muscleGroups = exercise.muscle_groups || [];
  const primaryMuscle = exercise.primary_muscle || (muscleGroups.length > 0 ? muscleGroups[0] : null);
  const modality = exercise.modality || null;
  const numSets = exItem.target_sets || 3;
  const technique = exItem.technique || 'straight';
  const isSpecialTechnique = technique !== 'straight';

  return (
    <>
      <Card
        draggable
        onDragStart={(e: any) => onDragStart(e, exIdx)}
        onDragOver={(e: any) => e.preventDefault()}
        onDrop={(e: any) => onDrop(e, exIdx)}
        className={`transition-all ${groupLabel ? 'border-l-4 border-l-emerald-400 shadow-sm' : ''}`}
      >
        <CardContent className="p-3 sm:p-4 space-y-3.5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2 border-b pb-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <span
                className="cursor-grab opacity-50 hover:opacity-100 p-1 mt-0.5 shrink-0"
                title="Arrastrar para reordenar"
              >
                <GripVertical className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Chip variant="soft" size="sm" className="font-bold">
                    #{exIdx + 1}
                  </Chip>
                  {groupLabel && (
                    <Chip size="sm" variant="primary" className="font-bold text-[11px] tracking-wider uppercase">
                      {technique === 'superset'
                        ? `Super-Serie ${groupLabel}`
                        : technique === 'multiseries'
                        ? `Multiserie ${groupLabel}`
                        : `Bloque ${groupLabel}`}
                    </Chip>
                  )}
                  {isSpecialTechnique && !groupLabel && (
                    <Chip size="sm" variant="soft" className="font-bold text-[11px] text-emerald-400">
                      {TECHNIQUE_LABELS[technique] || technique}
                    </Chip>
                  )}
                  <h4 className="text-sm sm:text-base font-bold truncate">{exercise.name}</h4>
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  {primaryMuscle && (
                    <Chip size="sm" variant="soft" className="text-[10px] font-semibold">
                      {primaryMuscle}
                    </Chip>
                  )}
                  {modality && (
                    <Chip size="sm" variant="soft" className="text-[10px] opacity-75">
                      {modality}
                    </Chip>
                  )}
                </div>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {onUpdateTarget && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2.5 text-xs font-semibold hover:text-emerald-400"
                  onPress={() => setIsEditModalOpen(true)}
                  aria-label={`Editar metas y notas de ${exercise.name}`}
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                  <span className="hidden sm:inline">Editar</span>
                </Button>
              )}

              <div className="flex items-center gap-0.5 p-0.5 rounded-xl border border-border bg-background">
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  isDisabled={exIdx === 0}
                  onPress={() => onMoveExercise(exIdx, exIdx - 1)}
                  aria-label={`Mover ${exercise.name} hacia arriba`}
                  className="h-7 w-7 text-foreground/80 hover:text-foreground"
                >
                  <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  isDisabled={exIdx === totalExercises - 1}
                  onPress={() => onMoveExercise(exIdx, exIdx + 1)}
                  aria-label={`Mover ${exercise.name} hacia abajo`}
                  className="h-7 w-7 text-foreground/80 hover:text-foreground"
                >
                  <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>

          {/* Target Prescription & Rest Timer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-secondary/60 border border-border rounded-xl p-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <Target className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <div className="text-xs font-medium">
                <span className="text-muted text-[11px] block font-semibold">Meta Prescrita:</span>
                <span className="font-extrabold text-foreground">
                  {exItem.target_sets}&nbsp;series × {exItem.target_reps}&nbsp;reps
                  {exItem.target_weight > 0 ? ` @ ${exItem.target_weight}\u00A0${exItem.weight_unit}` : ''}
                  {` (RIR\u00A0${exItem.target_rir})`}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-bold text-xs h-8 px-3 shrink-0"
              onPress={() => onStartRestTimer(exItem.target_rest_sec || 90)}
              aria-label={`Iniciar temporizador de descanso de ${exItem.target_rest_sec || 90} segundos`}
            >
              <Timer className="w-3.5 h-3.5 mr-1 text-emerald-400" aria-hidden="true" />
              <span>{exItem.target_rest_sec || 90}&nbsp;s Descanso</span>
            </Button>
          </div>

          {/* Coaching Notes Callout */}
          {exItem.notes && (
            <div className="flex items-start gap-2 text-xs bg-emerald-500/5 border border-emerald-500/20 p-2.5 rounded-xl text-foreground">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="min-w-0">
                <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-400 block mb-0.5">
                  Indicaciones Técnicas:
                </span>
                <p className="text-xs leading-relaxed text-foreground/85">{exItem.notes}</p>
              </div>
            </div>
          )}

          {/* Sets Recording Table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs text-left" aria-label={`Tabla de series para ${exercise.name}`}>
              <thead>
                <tr className="text-[10px] font-extrabold uppercase border-b border-border bg-surface-secondary text-muted">
                  <th scope="col" className="py-2 px-2 sm:px-2.5">Set</th>
                  <th scope="col" className="py-2 px-1.5 sm:px-2.5">Peso</th>
                  <th scope="col" className="py-2 px-1.5 sm:px-2.5">Reps</th>
                  <th scope="col" className="py-2 px-1.5 sm:px-2.5">RIR</th>
                  <th scope="col" className="py-2 px-1.5 sm:px-2.5 text-center w-11 sm:w-16">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Array.from({ length: numSets }, (_, i) => i + 1).map((setNum) => {
                  const rawSet = exSets[setNum];
                  const weightVal = rawSet
                    ? (rawSet.weight ?? rawSet.weight_used ?? exItem.target_weight ?? 0)
                    : (exItem.target_weight ?? 0);
                  const repsVal = rawSet ? (rawSet.reps ?? rawSet.completed_reps ?? '') : '';
                  const unitVal = rawSet
                    ? (rawSet.unit ?? rawSet.weight_unit ?? exItem.weight_unit ?? 'kg')
                    : (exItem.weight_unit ?? 'kg');
                  const rirVal = rawSet
                    ? (rawSet.actual_rir ?? rawSet.rir ?? exItem.target_rir ?? 2)
                    : (exItem.target_rir ?? 2);
                  const isCompleted = rawSet ? rawSet.completed : false;

                  const isLastSet = setNum === numSets;
                  const isDropSetItem = technique === 'dropset' && isLastSet;

                  return (
                    <tr
                      key={setNum}
                      className={`transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500/[0.06]'
                          : isDropSetItem
                          ? 'bg-amber-500/[0.04]'
                          : 'hover:bg-surface-secondary/40'
                      }`}
                    >
                      {/* Set Label */}
                      <td className="py-2 px-2 sm:px-2.5 font-bold">
                        <div className="flex items-center gap-1">
                          <span className="text-foreground text-xs">S{setNum}</span>
                          {isDropSetItem && (
                            <Chip size="sm" variant="soft" className="text-[8px] font-black text-amber-400 px-1 h-4">
                              DROP
                            </Chip>
                          )}
                        </div>
                      </td>

                      {/* Weight Used */}
                      <td className="py-2 px-1.5 sm:px-2.5">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            placeholder="0"
                            value={weightVal === '' ? '' : weightVal}
                            onChange={(e) => onSetChange(exItem.id, setNum, 'weight', e.target.value)}
                            aria-label={`Peso en ${unitVal} para serie ${setNum} de ${exercise.name}`}
                            className="w-13 sm:w-20 h-9 sm:h-10 rounded-xl border border-border px-1.5 sm:px-2 text-center text-xs font-black bg-surface text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-emerald-400 tabular-nums shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => onToggleUnit(exItem.id, setNum)}
                            aria-label={`Cambiar unidad de peso serie ${setNum}. Actual: ${unitVal}`}
                            className="h-9 sm:h-10 px-1.5 sm:px-2.5 text-[10px] sm:text-[11px] font-black uppercase rounded-lg border border-border hover:bg-surface-secondary text-emerald-400 shrink-0 transition-colors cursor-pointer"
                            title="Cambiar kg / lb"
                          >
                            {unitVal}
                          </button>
                        </div>
                      </td>

                      {/* Reps */}
                      <td className="py-2 px-1.5 sm:px-2.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={repsVal === '' ? '' : repsVal}
                          onChange={(e) => onSetChange(exItem.id, setNum, 'reps', e.target.value)}
                          aria-label={`Repeticiones para serie ${setNum} de ${exercise.name}`}
                          className="w-12 sm:w-20 h-9 sm:h-10 rounded-xl border border-border px-1 text-center text-xs font-black bg-surface text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-emerald-400 tabular-nums shadow-2xs"
                        />
                      </td>

                      {/* RIR */}
                      <td className="py-2 px-1.5 sm:px-2.5">
                        <select
                          value={String(rirVal)}
                          onChange={(e) => onSetChange(exItem.id, setNum, 'rir', e.target.value)}
                          aria-label={`RIR para serie ${setNum} de ${exercise.name}`}
                          className="w-16 sm:w-28 h-9 sm:h-10 rounded-xl border border-border px-1 sm:px-2 text-[11px] sm:text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-surface text-foreground cursor-pointer shadow-2xs"
                        >
                          {RIR_OPTIONS.map((opt) => (
                            <option key={opt.key} value={opt.key} className="bg-surface text-foreground">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Status / Checkbox */}
                      <td className="py-2 px-1.5 sm:px-2.5 text-center">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isCompleted}
                          aria-label={`Serie ${setNum} ${isCompleted ? 'completada. Haz clic para desmarcar' : 'pendiente. Haz clic para marcar como completada'}`}
                          className={`inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black shadow-xs'
                              : 'bg-surface border-border text-muted hover:border-emerald-500/40'
                          }`}
                          onClick={() => onSetChange(exItem.id, setNum, 'completed', !isCompleted)}
                          title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
                        >
                          {isCompleted ? <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" /> : null}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Target & Notes Modal */}
      {isEditModalOpen && onUpdateTarget && (
        <EditExerciseTargetModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          exItem={exItem}
          onSave={onUpdateTarget}
        />
      )}
    </>
  );
}

export default memo(ExerciseCard);
