import React, { memo } from 'react';
import { Card, CardContent, Input, Button } from '@heroui/react';
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
    <Card className="p-3.5 sm:p-4">
      <CardContent className="p-0 space-y-3.5">
        <div className="space-y-1">
          <label className="text-xs font-medium opacity-80 block">
            Nombre de la Rutina de este día
          </label>
          <Input
            placeholder="Ej. Pecho + Tríceps"
            value={activeConfig.routineName || ''}
            onChange={(e) => onRoutineNameChange(activeDayTab, e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold">
            Ejercicios ({exercises.length})
          </span>
          <Button
            variant="primary"
            size="sm"
            onPress={onOpenExerciseSelector}
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Ejercicio</span>
          </Button>
        </div>

        <div className="space-y-2.5">
          {exercises.length === 0 ? (
            <div className="text-center py-6 text-xs border border-dashed rounded-xl opacity-60">
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
      </CardContent>
    </Card>
  );
}

export default memo(DayRoutineEditor);
