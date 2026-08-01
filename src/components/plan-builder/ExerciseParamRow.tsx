import React, { memo } from 'react';
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
      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 space-y-2.5 transition-all shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="cursor-grab text-slate-500 hover:text-slate-300 p-1" title="Arrastrar para ordenar">
            <GripVertical className="w-4 h-4" />
          </span>
          <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 text-xs font-bold flex items-center justify-center">
            {idx + 1}
          </span>
          <h5 className="text-xs sm:text-sm font-bold text-white">{ex.name}</h5>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(idx, idx - 1)}
            disabled={idx === 0}
            className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30"
            title="Subir orden"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(idx, idx + 1)}
            disabled={idx === totalExercises - 1}
            className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30"
            title="Bajar orden"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="p-1 text-slate-500 hover:text-rose-400"
            title="Eliminar de rutina"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs bg-slate-950 p-2 rounded-lg border border-slate-800/80">
        <div>
          <label className="text-[10px] text-slate-400 block mb-0.5">Series</label>
          <input
            type="number"
            min="1"
            value={ex.target_sets}
            onChange={(e) => onUpdateParam(idx, 'target_sets', e.target.value)}
            className="w-full bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-800"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-0.5">Reps Meta</label>
          <input
            type="text"
            value={ex.target_reps}
            onChange={(e) => onUpdateParam(idx, 'target_reps', e.target.value)}
            className="w-full bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-800"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-0.5">RIR Meta</label>
          <select
            value={ex.target_rir}
            onChange={(e) => onUpdateParam(idx, 'target_rir', e.target.value)}
            className="w-full bg-slate-900 text-slate-200 px-1 py-1 rounded border border-slate-800"
          >
            <option value="0">RIR 0 (Fallo)</option>
            <option value="1">RIR 1</option>
            <option value="2">RIR 2</option>
            <option value="3">RIR 3</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-0.5">Descanso (s)</label>
          <input
            type="number"
            step="15"
            value={ex.target_rest_sec}
            onChange={(e) => onUpdateParam(idx, 'target_rest_sec', e.target.value)}
            className="w-full bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-800"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-0.5">Peso & Unidad</label>
          <div className="flex gap-1">
            <input
              type="number"
              step="0.5"
              value={ex.target_weight}
              onChange={(e) => onUpdateParam(idx, 'target_weight', e.target.value)}
              className="w-full bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-800"
            />
            <select
              value={ex.weight_unit}
              onChange={(e) => onUpdateParam(idx, 'weight_unit', e.target.value)}
              className="bg-slate-900 text-emerald-400 font-bold px-1 rounded border border-slate-800"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ExerciseParamRow);
