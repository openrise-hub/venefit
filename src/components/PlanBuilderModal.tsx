import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ModalBackdrop, ModalContainer, ModalDialog, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalCloseTrigger, Button } from '@heroui/react';
import { Calendar, CheckCircle2, RefreshCw } from 'lucide-react';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import PlanMetadataForm from './plan-builder/PlanMetadataForm';
import DayTabSelector from './plan-builder/DayTabSelector';
import DayRoutineEditor from './plan-builder/DayRoutineEditor';
import { formatDateISO } from '../lib/utils';
import { createAndReplicatePlan } from '../lib/api';
import { showToast } from '../lib/toastStore';
import { Client, ClientPlan } from '../types';

const DAYS_OF_WEEK = [
  { id: 1, name: 'Lunes', short: 'Lun' },
  { id: 2, name: 'Martes', short: 'Mar' },
  { id: 3, name: 'Miércoles', short: 'Mié' },
  { id: 4, name: 'Jueves', short: 'Jue' },
  { id: 5, name: 'Viernes', short: 'Vie' },
  { id: 6, name: 'Sábado', short: 'Sáb' },
  { id: 0, name: 'Domingo', short: 'Dom' }
];

interface PlanBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  client?: Client | null;
  existingPlans?: ClientPlan[];
  onPlanCreated: () => void;
}

export default function PlanBuilderModal({
  isOpen,
  onClose,
  clientId,
  client,
  existingPlans = [],
  onPlanCreated
}: PlanBuilderModalProps) {
  const today = formatDateISO(new Date());

  const defaultPlanName = useMemo(() => {
    const rawName = client?.name?.trim() || '';
    const firstName = rawName ? rawName.split(/\s+/)[0] : 'Cliente';
    const baseName = `Plan de ${firstName}`;

    const existingNames = existingPlans.map(p =>
      (p.name || p.plan_name || '').trim().toLowerCase()
    );

    if (!existingNames.includes(baseName.toLowerCase())) {
      return baseName;
    }

    let counter = 2;
    while (existingNames.includes(`${baseName} ${counter}`.toLowerCase())) {
      counter++;
    }
    return `${baseName} ${counter}`;
  }, [client, existingPlans]);

  const [planName, setPlanName] = useState(defaultPlanName);

  // Sync planName when modal opens or client changes
  useEffect(() => {
    if (isOpen) {
      setPlanName(defaultPlanName);
    }
  }, [isOpen, defaultPlanName]);
  const [startDateStr, setStartDateStr] = useState(today);
  const [endDateStr, setEndDateStr] = useState(() => {
    const end = new Date();
    end.setDate(end.getDate() + 30);
    return formatDateISO(end);
  });

  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState([1, 3, 5]);
  const [activeDayTab, setActiveDayTab] = useState(1);

  const [dayRoutinesConfig, setDayRoutinesConfig] = useState<Record<number, any>>({
    1: { routineName: 'Rutina Lunes - Empuje / Pecho', muscleGroups: ['Pecho', 'Tríceps'], exercises: [] },
    3: { routineName: 'Rutina Miércoles - Tracción / Espalda', muscleGroups: ['Espalda', 'Bíceps'], exercises: [] },
    5: { routineName: 'Rutina Viernes - Pierna / Hombros', muscleGroups: ['Cuádriceps', 'Glúteos', 'Hombros'], exercises: [] }
  });

  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleDaySelection = useCallback((dayId: number) => {
    setSelectedDaysOfWeek(prev => {
      let updated: number[];
      if (prev.includes(dayId)) {
        updated = prev.filter(d => d !== dayId);
      } else {
        updated = [...prev, dayId];
      }
      return updated.sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
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

  const handleRoutineNameChange = useCallback((dayId: number, val: string) => {
    setDayRoutinesConfig(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], routineName: val }
    }));
  }, []);

  const handleAddExercisesToCurrentDay = useCallback((newExercises: any[]) => {
    setDayRoutinesConfig(prev => {
      const currentConfig = prev[activeDayTab] || { routineName: 'Rutina', muscleGroups: [], exercises: [] };
      const formattedNew = newExercises.map(ex => ({
        exercise_id: ex.id,
        name: ex.name,
        primary_muscle: ex.primary_muscle,
        muscle_groups: ex.muscle_groups,
        modality: ex.modality,
        group_tag: '',
        technique: 'straight',
        notes: '',
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

  const updateExerciseParam = useCallback((dayId: number, index: number, key: string, value: any) => {
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

  const removeExerciseFromDay = useCallback((dayId: number, index: number) => {
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

  const moveExerciseOrder = useCallback((dayId: number, fromIndex: number, toIndex: number) => {
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

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
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
    <ModalBackdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContainer size="lg" placement="center" className="p-2 sm:p-4">
        <ModalDialog className="w-full max-w-2xl mx-auto overflow-hidden border border-border shadow-2xl bg-surface">
          <ModalHeader className="flex items-start sm:items-center justify-between border-b border-border pb-3.5 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Calendar className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <ModalHeading className="text-sm sm:text-base font-extrabold text-foreground">Creador de Planes</ModalHeading>
                <p className="text-[11px] sm:text-xs font-medium text-muted truncate">Diseña rutinas y replícalas en el rango de fechas</p>
              </div>
            </div>
            <ModalCloseTrigger onClick={onClose} aria-label="Cerrar creador de planes" />
          </ModalHeader>

          <ModalBody className="py-4 sm:py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <PlanMetadataForm
              planName={planName}
              onPlanNameChange={setPlanName}
              startDateStr={startDateStr}
              onStartDateChange={setStartDateStr}
              endDateStr={endDateStr}
              onEndDateChange={setEndDateStr}
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

          <ModalFooter className="border-t border-border pt-3.5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            <Button variant="ghost" size="sm" onPress={onClose} className="font-bold w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              isDisabled={saving}
              onPress={handleSaveAndReplicate}
              className="font-bold w-full sm:w-auto min-w-0 shadow-sm"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                  <span className="truncate">Guardando…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">Guardar y Replicar Plan</span>
                </>
              )}
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>

      <ExerciseSelectorModal
        isOpen={isExerciseSelectorOpen}
        onClose={() => setIsExerciseSelectorOpen(false)}
        onAddExercises={handleAddExercisesToCurrentDay}
      />
    </ModalBackdrop>
  );
}
