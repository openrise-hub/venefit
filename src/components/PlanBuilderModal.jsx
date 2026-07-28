import React, { useState, useCallback } from 'react';
import { ModalDialog, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { Calendar, CheckCircle2, X } from 'lucide-react';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import PlanMetadataForm from './plan-builder/PlanMetadataForm';
import DayTabSelector from './plan-builder/DayTabSelector';
import DayRoutineEditor from './plan-builder/DayRoutineEditor';
import { formatDateISO } from '../lib/utils';
import { createAndReplicatePlan } from '../lib/api';
import { showToast } from '../lib/toastStore';

const DAYS_OF_WEEK = [
  { id: 1, name: 'Lunes', short: 'Lun' },
  { id: 2, name: 'Martes', short: 'Mar' },
  { id: 3, name: 'Miércoles', short: 'Mié' },
  { id: 4, name: 'Jueves', short: 'Jue' },
  { id: 5, name: 'Viernes', short: 'Vie' },
  { id: 6, name: 'Sábado', short: 'Sáb' },
  { id: 0, name: 'Domingo', short: 'Dom' }
];

export default function PlanBuilderModal({ isOpen, onClose, clientId, onPlanCreated }) {
  const today = formatDateISO(new Date());

  const [planName, setPlanName] = useState('Plan de Entrenamiento Intensivo');
  const [startDateStr, setStartDateStr] = useState(today);
  const [endDateStr, setEndDateStr] = useState(() => {
    const end = new Date();
    end.setDate(end.getDate() + 30);
    return formatDateISO(end);
  });

  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState([1, 3, 5]);
  const [activeDayTab, setActiveDayTab] = useState(1);

  const [dayRoutinesConfig, setDayRoutinesConfig] = useState({
    1: { routineName: 'Rutina Lunes - Empuje / Pecho', muscleGroups: ['Pecho', 'Tríceps'], exercises: [] },
    3: { routineName: 'Rutina Miércoles - Tracción / Espalda', muscleGroups: ['Espalda', 'Bíceps'], exercises: [] },
    5: { routineName: 'Rutina Viernes - Pierna / Hombros', muscleGroups: ['Cuádriceps', 'Glúteos', 'Hombros'], exercises: [] }
  });

  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const setPresetDuration = useCallback((days) => {
    const start = new Date(startDateStr + 'T00:00:00');
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    setEndDateStr(formatDateISO(end));
  }, [startDateStr]);

  const toggleDaySelection = useCallback((dayId) => {
    setSelectedDaysOfWeek(prev => {
      if (prev.includes(dayId)) {
        return prev.filter(d => d !== dayId);
      } else {
        return [...prev, dayId];
      }
    });

    setDayRoutinesConfig(prev => {
      if (!prev[dayId]) {
        const dayInfo = DAYS_OF_WEEK.find(d => d.id === dayId);
        return {
          ...prev,
          [dayId]: {
            routineName: `Rutina ${dayInfo ? dayInfo.name : 'Día'}`,
            muscleGroups: [],
            exercises: []
          }
        };
      }
      return prev;
    });

    setActiveDayTab(dayId);
  }, []);

  const handleRoutineNameChange = useCallback((dayId, val) => {
    setDayRoutinesConfig(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], routineName: val }
    }));
  }, []);

  const handleAddExercisesToCurrentDay = useCallback((newExercises) => {
    setDayRoutinesConfig(prev => {
      const currentConfig = prev[activeDayTab] || { routineName: 'Rutina', muscleGroups: [], exercises: [] };
      const formattedNew = newExercises.map(ex => ({
        exercise_id: ex.id,
        name: ex.name,
        muscle_groups: ex.muscle_groups,
        target_sets: 3,
        target_reps: '10-12',
        target_rir: 2,
        target_rest_sec: 90,
        target_weight: 0,
        weight_unit: 'kg'
      }));

      return {
        ...prev,
        [activeDayTab]: {
          ...currentConfig,
          exercises: [...currentConfig.exercises, ...formattedNew]
        }
      };
    });
  }, [activeDayTab]);

  const updateExerciseParam = useCallback((dayId, index, key, value) => {
    setDayRoutinesConfig(prev => {
      const dayConf = prev[dayId];
      if (!dayConf) return prev;
      const updatedEx = [...dayConf.exercises];
      updatedEx[index] = { ...updatedEx[index], [key]: value };
      return {
        ...prev,
        [dayId]: { ...dayConf, exercises: updatedEx }
      };
    });
  }, []);

  const removeExerciseFromDay = useCallback((dayId, index) => {
    setDayRoutinesConfig(prev => {
      const dayConf = prev[dayId];
      if (!dayConf) return prev;
      const updatedEx = dayConf.exercises.filter((_, i) => i !== index);
      return {
        ...prev,
        [dayId]: { ...dayConf, exercises: updatedEx }
      };
    });
  }, []);

  const moveExerciseOrder = useCallback((dayId, fromIndex, toIndex) => {
    setDayRoutinesConfig(prev => {
      const dayConf = prev[dayId];
      if (!dayConf) return prev;
      const exercises = [...dayConf.exercises];
      if (toIndex < 0 || toIndex >= exercises.length) return prev;
      const item = exercises.splice(fromIndex, 1)[0];
      exercises.splice(toIndex, 0, item);
      return {
        ...prev,
        [dayId]: { ...dayConf, exercises }
      };
    });
  }, []);

  const handleDragStart = useCallback((e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleDrop = useCallback((e, toIndex) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex)) {
      moveExerciseOrder(activeDayTab, fromIndex, toIndex);
    }
  }, [activeDayTab, moveExerciseOrder]);

  const handleSaveAndReplicate = async () => {
    if (!planName.trim()) {
      showToast('Ingresa un nombre para el plan', 'info');
      return;
    }
    if (selectedDaysOfWeek.length === 0) {
      showToast('Selecciona al menos un día a entrenar', 'info');
      return;
    }

    try {
      setSaving(true);
      await createAndReplicatePlan({
        clientId,
        planName,
        startDateStr,
        endDateStr,
        selectedDaysOfWeek,
        dayRoutinesConfig
      });
      onPlanCreated();
      onClose();
    } catch (e) {
      console.error('[PlanBuilderModal:handleSaveAndReplicate] Error saving plan:', e);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const activeConfig = dayRoutinesConfig[activeDayTab] || { routineName: '', exercises: [] };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <ModalDialog className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl p-4 flex flex-col">
        <ModalHeader className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">Creador de Planes</h3>
              <p className="text-xs text-slate-400 font-normal">Diseña rutinas y replícalas en el rango de fechas</p>
            </div>
          </div>
          <Button isIconOnly size="sm" variant="light" onPress={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </ModalHeader>

        <ModalBody className="py-4 space-y-5 overflow-y-auto flex-1">
          <PlanMetadataForm
            planName={planName}
            onPlanNameChange={setPlanName}
            startDateStr={startDateStr}
            onStartDateChange={setStartDateStr}
            endDateStr={endDateStr}
            onEndDateChange={setEndDateStr}
            onPresetSelect={setPresetDuration}
          />

          <DayTabSelector
            selectedDaysOfWeek={selectedDaysOfWeek}
            activeDayTab={activeDayTab}
            onToggleDay={toggleDaySelection}
            onSelectActiveTab={setActiveDayTab}
          />

          {selectedDaysOfWeek.length > 0 && (
            <DayRoutineEditor
              activeDayTab={activeDayTab}
              activeConfig={activeConfig}
              onRoutineNameChange={handleRoutineNameChange}
              onOpenExerciseSelector={() => setIsExerciseSelectorOpen(true)}
              onUpdateExerciseParam={updateExerciseParam}
              onRemoveExercise={removeExerciseFromDay}
              onMoveExercise={moveExerciseOrder}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          )}
        </ModalBody>

        <ModalFooter className="border-t border-slate-800 flex justify-end gap-2">
          <Button variant="flat" size="sm" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="success"
            size="sm"
            className="font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20"
            isLoading={saving}
            onPress={handleSaveAndReplicate}
            startContent={!saving && <CheckCircle2 className="w-4 h-4" />}
          >
            Guardar y Replicar Plan
          </Button>
        </ModalFooter>
      </ModalDialog>

      <ExerciseSelectorModal
        isOpen={isExerciseSelectorOpen}
        onClose={() => setIsExerciseSelectorOpen(false)}
        onAddExercises={handleAddExercisesToCurrentDay}
      />
    </div>
  );
}
