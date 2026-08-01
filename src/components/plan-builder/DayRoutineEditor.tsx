import React, { memo } from 'react';
import { Plus } from 'lucide-react';
import ExerciseParamRow from './ExerciseParamRow';

interface DayRoutineEditorProps {
  activeDayTab: number;
  activeConfig: {
    routineName?: string;
    exercises?: any[];
  };
  onRoutineNameChange: (dayId: number, name: string) => void;
  onOpenExerciseSelector: () => void;
  onUpdateExerciseParam: (dayId: number, index: number, key: string, val: any) => void;
  onRemoveExercise: (dayId: number, index: number) => void;
  onMoveExercise: (dayId: number, from: number, to: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, toIndex: number) => void;
}

function DayRoutineEditor({
  activeDayTab,
  activeConfig,
  onRoutineNameChange,
  onOpenExerciseSelector,
  onUpdateExerciseParam,
  onRemoveExercise,
  onMoveExercise,
  onDragStart,
  onDrop
}: DayRoutineEditorProps) {
  const exercises = activeConfig.exercises || [];

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-950/40 p-3 space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">
          Nombre de la Rutina de este día
        </label>
        <input
          type="text"
          value={activeConfig.routineName || ''}
          onChange={(e) => onRoutineNameChange(activeDayTab, e.target.value)}
          className="w-full bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
          placeholder="Ej. Pecho + Tríceps"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-slate-300">
          Ejercicios ({exercises.length})
        </span>
        <button
          type="button"
          onClick={onOpenExerciseSelector}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Agregar Ejercicio
        </button>
      </div>

      <div className="space-y-2">
        {exercises.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
            Presiona "Agregar Ejercicio" para armar la rutina de este día.
          </div>
        ) : (
          exercises.map((ex, idx) => (
            <ExerciseParamRow
              key={idx}
              ex={ex}
              idx={idx}
              totalExercises={exercises.length}
              onUpdateParam={(index, key, val) => onUpdateExerciseParam(activeDayTab, index, key, val)}
              onRemove={(index) => onRemoveExercise(activeDayTab, index)}
              onMove={(from, to) => onMoveExercise(activeDayTab, from, to)}
              onDragStart={onDragStart}
              onDrop={onDrop}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default memo(DayRoutineEditor);
