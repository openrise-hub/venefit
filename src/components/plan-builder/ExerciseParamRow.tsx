import React, { memo } from 'react';
import { Card, CardContent, Input, Button } from '@heroui/react';
import { GripVertical, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

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
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, idx)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, idx)}
    >
      <Card className="p-2 sm:p-3">
        <CardContent className="p-0 space-y-2.5">
          <div className="flex items-center justify-between gap-2 border-b pb-2">
            <div className="flex items-center gap-2">
              <span className="cursor-grab opacity-60 hover:opacity-100 p-1">
                <GripVertical className="w-4 h-4" />
              </span>
              <span className="w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center border">
                {idx + 1}
              </span>
              <h5 className="text-xs sm:text-sm font-bold">{ex.name}</h5>
            </div>

            <div className="flex items-center gap-1">
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

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs p-2 rounded-xl border">
            <div className="space-y-1">
              <label className="text-[10px] font-medium opacity-70 block">Series</label>
              <Input
                type="number"
                min="1"
                value={ex.target_sets ? Number(ex.target_sets) : undefined}
                onChange={(e) => onUpdateParam(idx, 'target_sets', e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-medium opacity-70 block">Reps Meta</label>
              <Input
                type="text"
                value={ex.target_reps}
                onChange={(e) => onUpdateParam(idx, 'target_reps', e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-medium opacity-70 block">RIR Meta</label>
              <select
                value={ex.target_rir}
                onChange={(e) => onUpdateParam(idx, 'target_rir', e.target.value)}
                className="w-full h-9 rounded-xl border px-2 text-xs focus:outline-none bg-transparent"
              >
                <option value="0">RIR 0 (Fallo)</option>
                <option value="1">RIR 1</option>
                <option value="2">RIR 2</option>
                <option value="3">RIR 3</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-medium opacity-70 block">Descanso (s)</label>
              <Input
                type="number"
                step="15"
                value={ex.target_rest_sec ? Number(ex.target_rest_sec) : undefined}
                onChange={(e) => onUpdateParam(idx, 'target_rest_sec', e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-medium opacity-70 block">Peso & Unidad</label>
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
                  className="h-9 rounded-xl border px-2 text-xs font-bold focus:outline-none bg-transparent"
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
