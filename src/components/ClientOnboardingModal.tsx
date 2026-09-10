import React, { useState, useCallback, useMemo } from 'react';
import {
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalFooter,
  ModalCloseTrigger,
  Input,
  Button,
  Chip
} from '@heroui/react';
import {
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { createClient, createAndReplicatePlan } from '../lib/api';
import { formatDateISO, getUpcomingDateISO } from '../lib/utils';
import { showToast } from '../lib/toastStore';
import DayTabSelector, { DAYS_OF_WEEK } from './plan-builder/DayTabSelector';
import DayRoutineEditor from './plan-builder/DayRoutineEditor';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import { DayRoutineConfig, Exercise } from '../types';

interface ClientOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: any) => void;
}

export default function ClientOnboardingModal({
  isOpen,
  onClose,
  onClientCreated
}: ClientOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('Hipertrofia Muscular y Fuerza');
  const [weight, setWeight] = useState('75.0');
  const [height, setHeight] = useState('175.0');
  const [notes, setNotes] = useState('');

  const [planName, setPlanName] = useState('Fase 1: Mesociclo de Hipertrofia');
  const [startDateStr, setStartDateStr] = useState(() => formatDateISO(new Date()));
  const [endDateStr, setEndDateStr] = useState(() => getUpcomingDateISO(28));
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([1, 3, 5]);

  const [dayRoutinesConfig, setDayRoutinesConfig] = useState<Record<number, DayRoutineConfig>>({
    1: { routineName: 'Empuje (Pecho, Hombro, Tríceps)', muscleGroups: ['Pecho', 'Hombro', 'Tríceps'], exercises: [] },
    3: { routineName: 'Tracción (Espalda, Bíceps)', muscleGroups: ['Espalda', 'Bíceps'], exercises: [] },
    5: { routineName: 'Pierna (Cuádriceps, Isquios, Glúteos)', muscleGroups: ['Pierna'], exercises: [] }
  });
  const [activeDayTab, setActiveDayTab] = useState<number>(1);

  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const activeConfig = useMemo(() => {
    return dayRoutinesConfig[activeDayTab] || { routineName: 'Empuje (Pecho, Hombro, Tríceps)', muscleGroups: [], exercises: [] };
  }, [dayRoutinesConfig, activeDayTab]);

  const toggleDayOfWeek = useCallback((dayId: number) => {
    setSelectedDaysOfWeek(prev => {
      let updated: number[];
      if (prev.includes(dayId)) {
        if (prev.length === 1) {
          showToast('Selecciona al menos un día de entrenamiento', 'info');
          return prev;
        }
        updated = prev.filter(d => d !== dayId);
      } else {
        updated = [...prev, dayId].sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
      }

      setDayRoutinesConfig(oldConfigs => {
        const next = { ...oldConfigs };
        if (!next[dayId]) {
          next[dayId] = {
            routineName: 'Empuje (Pecho, Hombro, Tríceps)',
            muscleGroups: [],
            exercises: []
          };
        }
        return next;
      });

      if (!updated.includes(activeDayTab)) {
        setActiveDayTab(updated[0]);
      }

      return updated;
    });
  }, [activeDayTab]);

  const handleRoutineNameChange = useCallback((dayId: number, routineName: string) => {
    setDayRoutinesConfig(prev => ({
      ...prev,
      [dayId]: {
        ...(prev[dayId] || { muscleGroups: [], exercises: [] }),
        routineName
      }
    }));
  }, []);

  const handleAddExercisesToActiveDay = useCallback((selectedExercises: Exercise[]) => {
    setDayRoutinesConfig(prev => {
      const current = prev[activeDayTab] || { routineName: 'Empuje (Pecho, Hombro, Tríceps)', muscleGroups: [], exercises: [] };
      const newItems = selectedExercises.map(ex => ({
        exercise_id: ex.id,
        name: ex.name,
        muscle_groups: ex.muscle_groups || [],
        target_sets: 3,
        target_reps: '10-12',
        target_rir: 2,
        target_rest_sec: 90,
        target_weight: 0,
        weight_unit: 'kg' as const
      }));

      return {
        ...prev,
        [activeDayTab]: {
          ...current,
          exercises: [...(current.exercises || []), ...newItems]
        }
      };
    });
    setIsExerciseSelectorOpen(false);
  }, [activeDayTab]);

  const handleUpdateExerciseParam = useCallback((dayId: number, index: number, key: string, val: any) => {
    setDayRoutinesConfig(prev => {
      const current = prev[dayId];
      if (!current || !current.exercises) return prev;
      const updatedExercises = [...current.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [key]: val
      };
      return {
        ...prev,
        [dayId]: {
          ...current,
          exercises: updatedExercises
        }
      };
    });
  }, []);

  const handleRemoveExercise = useCallback((dayId: number, index: number) => {
    setDayRoutinesConfig(prev => {
      const current = prev[dayId];
      if (!current || !current.exercises) return prev;
      const updatedExercises = current.exercises.filter((_, i) => i !== index);
      return {
        ...prev,
        [dayId]: {
          ...current,
          exercises: updatedExercises
        }
      };
    });
  }, []);

  const handleMoveExercise = useCallback((dayId: number, fromIndex: number, toIndex: number) => {
    setDayRoutinesConfig(prev => {
      const current = prev[dayId];
      if (!current || !current.exercises) return prev;
      if (toIndex < 0 || toIndex >= current.exercises.length) return prev;
      const updated = [...current.exercises];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return {
        ...prev,
        [dayId]: {
          ...current,
          exercises: updated
        }
      };
    });
  }, []);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        showToast('Ingresa el nombre del cliente', 'info');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!planName.trim()) {
        showToast('Ingresa el nombre del mesociclo', 'info');
        return;
      }
      if (selectedDaysOfWeek.length === 0) {
        showToast('Selecciona al menos un día de entrenamiento', 'info');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const newClient = await createClient({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        goal: goal.trim(),
        current_weight: parseFloat(weight || '0'),
        height: parseFloat(height || '0'),
        notes: notes.trim()
      });

      await createAndReplicatePlan({
        clientId: newClient.id,
        planName: planName.trim(),
        startDateStr,
        endDateStr,
        selectedDaysOfWeek,
        dayRoutinesConfig
      });

      showToast(`Cliente "${newClient.name}" y mesociclo creados exitosamente`, 'success');
      onClientCreated(newClient);
      onClose();
    } catch (err) {
      console.error('[ClientOnboardingModal] Failed to complete onboarding:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalBackdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
        <ModalContainer size="lg" placement="center">
          <ModalDialog className="w-full max-w-2xl">
            <ModalHeader className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl border flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-emerald-400 shrink-0" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <ModalHeading className="text-base font-bold truncate">
                      Nuevo Cliente y Mesociclo
                    </ModalHeading>
                    <Chip size="sm" variant="soft">
                      Paso {currentStep} de 3
                    </Chip>
                  </div>
                  <p className="text-xs font-normal opacity-70 truncate">
                    {currentStep === 1 && 'Datos personales y perfil del cliente'}
                    {currentStep === 2 && 'Duración del mesociclo y días de entrenamiento'}
                    {currentStep === 3 && 'Selección de splits y armado de ejercicios por día'}
                  </p>
                </div>
              </div>
              <ModalCloseTrigger onClick={onClose} />
            </ModalHeader>

            <ModalBody className="py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-semibold block opacity-80">Nombre Completo *</label>
                    <Input
                      placeholder="Ej. Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-semibold block opacity-80">Correo Electrónico</label>
                      <Input
                        type="email"
                        placeholder="juan@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-semibold block opacity-80">Teléfono</label>
                      <Input
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-semibold block opacity-80">Objetivo Principal</label>
                    <Input
                      placeholder="Ej. Hipertrofia Muscular y Fuerza"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-semibold block opacity-80">Peso Actual (kg)</label>
                      <Input
                        type="number"
                        placeholder="75.0"
                        value={weight ? Number(weight) : undefined}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-semibold block opacity-80">Altura (cm)</label>
                      <Input
                        type="number"
                        placeholder="175.0"
                        value={height ? Number(height) : undefined}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-semibold block opacity-80">Notas / Observaciones</label>
                    <Input
                      placeholder="Ej. Lesiones previas, disponibilidad..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-semibold block opacity-80">Nombre del Mesociclo / Plan *</label>
                    <Input
                      placeholder="Ej. Fase 1: Mesociclo de Hipertrofia 8 Semanas"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-semibold block opacity-80">Inicio del Mesociclo</label>
                      <Input
                        type="date"
                        value={startDateStr}
                        onChange={(e) => setStartDateStr(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-semibold block opacity-80">Término del Mesociclo</label>
                      <Input
                        type="date"
                        value={endDateStr}
                        onChange={(e) => setEndDateStr(e.target.value)}
                      />
                    </div>
                  </div>

                  <DayTabSelector
                    selectedDaysOfWeek={selectedDaysOfWeek}
                    onToggleDay={toggleDayOfWeek}
                    hideActiveTabs={true}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold block opacity-80">
                      Selecciona el día para configurar su rutina:
                    </label>
                    <div className="flex items-center gap-1.5 p-1 rounded-2xl border overflow-x-auto">
                      {selectedDaysOfWeek.map((dayId) => {
                        const dayObj = DAYS_OF_WEEK.find(d => d.id === dayId);
                        const isActive = activeDayTab === dayId;
                        return (
                          <Button
                            key={dayId}
                            size="sm"
                            variant={isActive ? "primary" : "ghost"}
                            className="shrink-0 font-bold text-xs"
                            onPress={() => setActiveDayTab(dayId)}
                          >
                            {dayObj ? dayObj.name : `Día ${dayId}`}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <DayRoutineEditor
                    activeDayTab={activeDayTab}
                    activeConfig={activeConfig}
                    onRoutineNameChange={handleRoutineNameChange}
                    onOpenExerciseSelector={() => setIsExerciseSelectorOpen(true)}
                    onUpdateExerciseParam={handleUpdateExerciseParam}
                    onRemoveExercise={handleRemoveExercise}
                    onMoveExercise={handleMoveExercise}
                    onDragStart={() => {}}
                    onDrop={() => {}}
                  />
                </div>
              )}
            </ModalBody>

            <ModalFooter className="border-t pt-4 flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <Button variant="ghost" size="sm" onPress={handleBack}>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Atrás</span>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onPress={onClose}>
                  Cancelar
                </Button>

                {currentStep < 3 ? (
                  <Button variant="primary" size="sm" onPress={handleNext}>
                    <span>Siguiente</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    isDisabled={saving}
                    onPress={handleSubmit}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{saving ? 'Guardando...' : 'Crear Cliente y Mesociclo'}</span>
                  </Button>
                )}
              </div>
            </ModalFooter>
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>

      {isExerciseSelectorOpen && (
        <ExerciseSelectorModal
          isOpen={isExerciseSelectorOpen}
          onClose={() => setIsExerciseSelectorOpen(false)}
          onAddExercises={handleAddExercisesToActiveDay}
        />
      )}
    </>
  );
}
