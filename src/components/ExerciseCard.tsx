import React, { memo, useState } from 'react';
import { Card, CardContent, Chip, Button, ModalBackdrop, ModalContainer, ModalDialog, ModalHeading } from '@heroui/react';
import { GripVertical, Timer, ArrowUp, ArrowDown, Check, Info, Edit3, Target, Trash2, Plus, Minus } from 'lucide-react';
import { RoutineExercise, ExerciseSetResult } from '../types';
import EditExerciseTargetModal from './EditExerciseTargetModal';
import VenefitSelect, { VenefitSelectOption } from './VenefitSelect';

const RIR_OPTIONS: VenefitSelectOption[] = [
  { value: '0', label: 'RIR 0 (Fallo)', triggerLabel: 'RIR 0' },
  { value: '1', label: 'RIR 1' },
  { value: '2', label: 'RIR 2' },
  { value: '3', label: 'RIR 3' },
  { value: '4', label: 'RIR 4+' }
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
  onSetBlur?: (routineExId: string, setNum: number) => void;
  onToggleUnit: (routineExId: string, setNum: number) => void;
  onStartRestTimer: (seconds: number) => void;
  onMoveExercise: (fromIndex: number, toIndex: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, toIndex: number) => void;
  onUpdateTarget?: (routineExId: string, updates: Partial<RoutineExercise>) => Promise<void>;
  onRemoveExercise?: (routineExId: string) => Promise<void> | void;
}

function ExerciseCard({
  exItem,
  exIdx,
  exSets,
  totalExercises,
  groupLabel,
  onSetChange,
  onSetBlur,
  onToggleUnit,
  onStartRestTimer,
  onMoveExercise,
  onDragStart,
  onDrop,
  onUpdateTarget,
  onRemoveExercise
}: ExerciseCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const exercise =
    exItem.expandedExercise ||
    (typeof exItem.exercise === 'object' ? (exItem.exercise as any) : null) ||
    { name: 'Ejercicio', muscle_groups: [] };

  const displayName = exItem.custom_name || exercise.name || 'Ejercicio';
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
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-sm sm:text-base font-bold truncate">{displayName}</h4>
                    {exItem.custom_name && exItem.custom_name !== exercise.name && (
                      <span className="text-[10px] text-muted italic truncate">
                        (Catálogo: {exercise.name})
                      </span>
                    )}
                  </div>
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
                  aria-label={`Editar ejercicio y metas de ${displayName}`}
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
                  aria-label={`Mover ${displayName} hacia arriba`}
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
                  aria-label={`Mover ${displayName} hacia abajo`}
                  className="h-7 w-7 text-foreground/80 hover:text-foreground"
                >
                  <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              </div>

              {onRemoveExercise && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  onPress={() => setIsDeleteConfirmOpen(true)}
                  aria-label={`Eliminar ${displayName} de la rutina de hoy`}
                  className="h-8 w-8 text-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              )}
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
                            onBlur={() => onSetBlur?.(exItem.id, setNum)}
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
                          onBlur={() => onSetBlur?.(exItem.id, setNum)}
                          aria-label={`Repeticiones para serie ${setNum} de ${exercise.name}`}
                          className="w-12 sm:w-20 h-9 sm:h-10 rounded-xl border border-border px-1 text-center text-xs font-black bg-surface text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-emerald-400 tabular-nums shadow-2xs"
                        />
                      </td>

                      {/* RIR */}
                      <td className="py-2 px-1.5 sm:px-2.5">
                        <VenefitSelect
                          value={String(rirVal)}
                          onChange={(val) => onSetChange(exItem.id, setNum, 'rir', val)}
                          options={RIR_OPTIONS}
                          aria-label={`RIR para serie ${setNum} de ${displayName}`}
                          compact
                          fullWidth={false}
                          surfaceTone="surface"
                          triggerClassName="w-[74px] sm:w-28 h-9 sm:h-10 font-bold"
                          valueClassName="text-[11px] sm:text-xs font-bold"
                          popoverClassName="min-w-[max(var(--trigger-width),165px)]"
                        />
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

          {/* Quick Series Adjusters (+ / - Serie for today) */}
          {onUpdateTarget && (
            <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
              <span className="text-[11px] text-muted font-medium">
                Series hoy: <strong className="text-foreground font-black tabular-nums">{numSets}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                {numSets > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-[11px] font-semibold text-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    onPress={() => onUpdateTarget(exItem.id, { target_sets: Math.max(1, numSets - 1) })}
                    aria-label={`Quitar una serie de ${displayName}`}
                  >
                    <Minus className="w-3 h-3 mr-1" aria-hidden="true" />
                    Quitar Serie
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                  onPress={() => onUpdateTarget(exItem.id, { target_sets: numSets + 1 })}
                  aria-label={`Agregar una serie a ${displayName}`}
                >
                  <Plus className="w-3 h-3 mr-1" aria-hidden="true" />
                  Agregar Serie
                </Button>
              </div>
            </div>
          )}
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

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && onRemoveExercise && (
        <ModalBackdrop isOpen={isDeleteConfirmOpen} onOpenChange={(open) => !open && setIsDeleteConfirmOpen(false)}>
          <ModalContainer size="sm" placement="center" className="p-4">
            <ModalDialog className="w-full max-w-sm mx-auto p-5 border border-border bg-surface rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <ModalHeading className="text-sm font-bold text-foreground">
                    ¿Quitar de la rutina de hoy?
                  </ModalHeading>
                  <p className="text-[11px] text-muted">Esta acción solo afecta la sesión de hoy</p>
                </div>
              </div>
              <p className="text-xs text-muted leading-relaxed mb-5">
                Se removerá <strong className="text-foreground">{displayName}</strong> y sus series registradas en esta fecha.
              </p>
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => setIsDeleteConfirmOpen(false)}
                  className="text-xs font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onPress={() => {
                    setIsDeleteConfirmOpen(false);
                    onRemoveExercise(exItem.id);
                  }}
                  className="text-xs font-bold"
                >
                  Eliminar Ejercicio
                </Button>
              </div>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </>
  );
}

export default memo(ExerciseCard);
