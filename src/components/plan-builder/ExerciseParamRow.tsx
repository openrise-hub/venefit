import React, { memo } from 'react';
import { Card, CardContent, Input, Button, Chip } from '@heroui/react';
import { GripVertical, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { TrainingTechnique } from '../../types';

export const TECHNIQUE_OPTIONS: Array<{ key: TrainingTechnique; label: string }> = [
  { key: 'straight', label: 'Serie Normal' },
  { key: 'superset', label: 'Superserie' },
  { key: 'multiseries', label: 'Multiserie / Serie Gigante' },
  { key: 'dropset', label: 'Drop Set (Serie Descendente)' },
  { key: 'rest_pause', label: 'Rest-Pause' },
  { key: 'myo_reps', label: 'Myo-Reps' },
  { key: 'top_backoff', label: 'Top Set / Back-off' }
];

export const GROUP_TAG_OPTIONS = [
  { key: '', label: 'Individual' },
  { key: 'A', label: 'Bloque A (A1, A2...)' },
  { key: 'B', label: 'Bloque B (B1, B2...)' },
  { key: 'C', label: 'Bloque C (C1, C2...)' },
  { key: 'D', label: 'Bloque D (D1, D2...)' }
];

interface ExerciseParamRowProps {
  ex: any;
  idx: number;
  totalExercises: number;
  onUpdateParam: (index: number, key: string, val: any) => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, toIndex: number) => void;
}

function ExerciseParamRow({
  ex,
  idx,
  totalExercises,
  onUpdateParam,
  onRemove,
  onMove,
  onDragStart,
  onDrop
}: ExerciseParamRowProps) {
  const isSpecialTechnique = ex.technique && ex.technique !== 'straight';
  const hasGroup = Boolean(ex.group_tag);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, idx)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, idx)}
    >
      <Card className={`p-2.5 sm:p-3 transition-all ${hasGroup ? 'border-l-4 border-l-emerald-400' : ''}`}>
        <CardContent className="p-0 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b pb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="cursor-grab opacity-60 hover:opacity-100 p-1 shrink-0">
                <GripVertical className="w-4 h-4" />
              </span>
              <span className="w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center border shrink-0">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <h5 className="text-xs sm:text-sm font-bold truncate">{ex.name}</h5>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  {hasGroup && (
                    <Chip size="sm" variant="primary" className="text-[10px] font-bold">
                      Bloque {ex.group_tag}
                    </Chip>
                  )}
                  {isSpecialTechnique && (
                    <Chip size="sm" variant="soft" className="text-[10px] font-semibold text-emerald-400">
                      {TECHNIQUE_OPTIONS.find(t => t.key === ex.technique)?.label || ex.technique}
                    </Chip>
                  )}
                  {ex.primary_muscle && (
                    <Chip size="sm" variant="soft" className="text-[10px]">
                      {ex.primary_muscle}
                    </Chip>
                  )}
                  {ex.modality && (
                    <Chip size="sm" variant="soft" className="text-[10px] opacity-75">
                      {ex.modality}
                    </Chip>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                isDisabled={idx === 0}
                onPress={() => onMove(idx, idx - 1)}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                isDisabled={idx === totalExercises - 1}
                onPress={() => onMove(idx, idx + 1)}
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="danger-soft"
                onPress={() => onRemove(idx)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground block">Tecnica de Ejecucion</label>
              <select
                value={ex.technique || 'straight'}
                onChange={(e) => onUpdateParam(idx, 'technique', e.target.value)}
                className="w-full h-9 rounded-xl border px-2 text-xs font-semibold focus:outline-none bg-background text-foreground cursor-pointer"
              >
                {TECHNIQUE_OPTIONS.map(opt => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground block">Enlace Superserie / Bloque</label>
              <select
                value={ex.group_tag || ''}
                onChange={(e) => onUpdateParam(idx, 'group_tag', e.target.value)}
                className="w-full h-9 rounded-xl border px-2 text-xs font-semibold focus:outline-none bg-background text-foreground cursor-pointer"
              >
                {GROUP_TAG_OPTIONS.map(opt => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-foreground block">Notas / Indicaciones</label>
              <Input
                type="text"
                placeholder="Ej. Reducir 25% peso en ultimo set"
                value={ex.notes || ''}
                onChange={(e) => onUpdateParam(idx, 'notes', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs p-2 rounded-xl border bg-background/50">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground block">Series</label>
              <Input
                type="number"
                min="1"
                value={ex.target_sets ? Number(ex.target_sets) : undefined}
                onChange={(e) => onUpdateParam(idx, 'target_sets', e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground block">Reps Meta</label>
              <Input
                type="text"
                value={ex.target_reps}
                onChange={(e) => onUpdateParam(idx, 'target_reps', e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground block">RIR Meta</label>
              <select
                value={ex.target_rir}
                onChange={(e) => onUpdateParam(idx, 'target_rir', e.target.value)}
                className="w-full h-9 rounded-xl border px-2 text-xs font-semibold focus:outline-none bg-background text-foreground"
              >
                <option value="0">RIR 0 (Fallo)</option>
                <option value="1">RIR 1</option>
                <option value="2">RIR 2</option>
                <option value="3">RIR 3</option>
                <option value="4">RIR 4+</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground block">Descanso (s)</label>
              <Input
                type="number"
                step="15"
                value={ex.target_rest_sec ? Number(ex.target_rest_sec) : undefined}
                onChange={(e) => onUpdateParam(idx, 'target_rest_sec', e.target.value)}
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-foreground block">Peso & Unidad</label>
              <div className="flex gap-1.5 items-center">
                <Input
                  type="number"
                  step="0.5"
                  value={ex.target_weight ? Number(ex.target_weight) : undefined}
                  onChange={(e) => onUpdateParam(idx, 'target_weight', e.target.value)}
                />
                <select
                  value={ex.weight_unit}
                  onChange={(e) => onUpdateParam(idx, 'weight_unit', e.target.value)}
                  className="h-9 rounded-xl border px-2 text-xs font-bold focus:outline-none bg-background text-foreground"
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default memo(ExerciseParamRow);
