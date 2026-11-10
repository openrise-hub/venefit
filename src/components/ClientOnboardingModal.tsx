import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalFooter,
  ModalCloseTrigger,
  Button,
  Chip
} from '@heroui/react';
import {
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Calendar,
  Minus,
  Plus
} from 'lucide-react';
import { createClient, createAndReplicatePlan } from '../lib/api';
import { formatDateISO, calculatePlanDates } from '../lib/utils';
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

  const [planName, setPlanName] = useState('Plan de Entrenamiento');
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [startDayId, setStartDayId] = useState(1);
  const [startedBefore, setStartedBefore] = useState(false);
  const [startDateStr, setStartDateStr] = useState(() => formatDateISO(new Date()));
  const [endDateStr, setEndDateStr] = useState(() => {
    const end = new Date();
    end.setDate(end.getDate() + 55);
    return formatDateISO(end);
  });
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

  useEffect(() => {
    const { startDateStr: newStart, endDateStr: newEnd } = calculatePlanDates({
      durationWeeks,
      startDayId,
      startedBefore
    });
    setStartDateStr(newStart);
    setEndDateStr(newEnd);
  }, [durationWeeks, startDayId, startedBefore]);

  const computedRange = useMemo(() => {
    if (!startDateStr || !endDateStr) return null;
    const s = new Date(startDateStr + 'T00:00:00');
    const e = new Date(endDateStr + 'T00:00:00');

    const sFormatted = s.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
    const eFormatted = e.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

    let statusText = '';
    if (startedBefore) {
      statusText = 'Plan en curso (retroactivo)';
    } else {
      const selectedDayObj = DAYS_OF_WEEK.find(d => d.id === startDayId);
      statusText = `Inicia el próximo ${selectedDayObj ? selectedDayObj.name : 'día programado'}`;
    }

    return {
      formattedText: `${sFormatted} → ${eFormatted}`,
      statusText
    };
  }, [startDateStr, endDateStr, startedBefore, startDayId]);

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
        updated = [...prev, dayId];
      }
      const sorted = updated.sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));

      if (!sorted.includes(activeDayTab)) {
        setActiveDayTab(sorted[0]);
      }

      return sorted;
    });

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
      const firstName = name.trim().split(/\s+/)[0] || 'Cliente';
      if (!planName || planName === 'Plan de Entrenamiento') {
        setPlanName(`Plan de ${firstName}`);
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
        <ModalContainer size="lg" placement="center" className="p-2 sm:p-4">
          <ModalDialog className="w-full max-w-2xl mx-auto overflow-hidden border border-border shadow-2xl bg-surface">
            <ModalHeader className="flex items-start sm:items-center justify-between border-b border-border pb-3.5 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                  <UserPlus className="w-5 h-5 shrink-0" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <ModalHeading className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
                      Nuevo Cliente y Mesociclo
                    </ModalHeading>
                    <Chip size="sm" variant="soft" className="font-bold text-[10px] text-emerald-400 border border-emerald-500/30 h-5 px-1.5">
                      Paso {currentStep}/3
                    </Chip>
                  </div>
                  <p className="text-[11px] sm:text-xs font-medium text-muted truncate">
                    {currentStep === 1 && 'Datos personales y perfil del cliente'}
                    {currentStep === 2 && 'Duración del mesociclo y días de entrenamiento'}
                    {currentStep === 3 && 'Selección de splits y armado de ejercicios'}
                  </p>
                </div>
              </div>
              <ModalCloseTrigger onClick={onClose} aria-label="Cerrar ventana de nuevo cliente" />
            </ModalHeader>

            <ModalBody className="py-4 sm:py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5 min-w-0">
                    <label htmlFor="new-client-name" className="text-xs font-bold text-foreground block">
                      Nombre Completo <span className="text-emerald-500">*</span>
                    </label>
                    <input
                      id="new-client-name"
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <label htmlFor="new-client-email" className="text-xs font-bold text-foreground block">
                        Correo Electrónico
                      </label>
                      <input
                        id="new-client-email"
                        type="email"
                        placeholder="juan@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <label htmlFor="new-client-phone" className="text-xs font-bold text-foreground block">
                        Teléfono
                      </label>
                      <input
                        id="new-client-phone"
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <label htmlFor="new-client-goal" className="text-xs font-bold text-foreground block">
                      Objetivo Principal
                    </label>
                    <input
                      id="new-client-goal"
                      type="text"
                      placeholder="Ej. Hipertrofia Muscular y Fuerza"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <label htmlFor="new-client-weight" className="text-xs font-bold text-foreground block">
                        Peso Actual (kg)
                      </label>
                      <input
                        id="new-client-weight"
                        type="number"
                        step="0.1"
                        placeholder="75.0"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs tabular-nums"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <label htmlFor="new-client-height" className="text-xs font-bold text-foreground block">
                        Altura (cm)
                      </label>
                      <input
                        id="new-client-height"
                        type="number"
                        step="0.1"
                        placeholder="175.0"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <label htmlFor="new-client-notes" className="text-xs font-bold text-foreground block">
                      Notas / Observaciones
                    </label>
                    <input
                      id="new-client-notes"
                      type="text"
                      placeholder="Ej. Lesiones previas, disponibilidad…"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5 w-full">
                    <label htmlFor="new-plan-name" className="text-xs font-bold text-foreground block">
                      Nombre del Mesociclo / Plan <span className="text-emerald-500">*</span>
                    </label>
                    <input
                      id="new-plan-name"
                      type="text"
                      placeholder="Ej. Plan de Carlos"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
                    />
                  </div>

                  {/* Simplified Number of Weeks Selector */}
                  <div className="space-y-1.5">
                    <label htmlFor="onboarding-duration-weeks-input" className="text-xs font-bold text-foreground block">
                      Duración del Mesociclo:
                    </label>
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-border bg-surface-secondary/40">
                      <span className="text-xs font-bold text-foreground">
                        Número de semanas
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDurationWeeks(prev => Math.max(1, prev - 1))}
                          aria-label="Disminuir semanas"
                          className="w-9 h-9 rounded-xl border border-border bg-surface text-foreground font-bold flex items-center justify-center hover:bg-surface-secondary active:scale-95 transition-all cursor-pointer shadow-2xs"
                        >
                          <Minus className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <input
                          id="onboarding-duration-weeks-input"
                          type="number"
                          min={1}
                          max={52}
                          value={durationWeeks}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val >= 1 && val <= 52) {
                              setDurationWeeks(val);
                            }
                          }}
                          aria-label="Número de semanas de duración"
                          className="w-14 h-9 text-center font-black text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-400 tabular-nums shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setDurationWeeks(prev => Math.min(52, prev + 1))}
                          aria-label="Aumentar semanas"
                          className="w-9 h-9 rounded-xl border border-border bg-surface text-foreground font-bold flex items-center justify-center hover:bg-surface-secondary active:scale-95 transition-all cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <span className="text-xs font-bold text-muted ml-1 select-none">semanas</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-foreground block">
                      Día de inicio semanal:
                    </span>
                    <div role="radiogroup" aria-label="Día de inicio semanal" className="grid grid-cols-7 gap-1.5 sm:gap-2 max-w-sm sm:max-w-md">
                      {DAYS_OF_WEEK.map((d) => {
                        const isSelected = startDayId === d.id;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={`Iniciar los ${d.name}s`}
                            onClick={() => setStartDayId(d.id)}
                            className={`w-full h-8 sm:h-9 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                              isSelected
                                ? 'bg-emerald-500 text-slate-950 shadow-xs ring-2 ring-emerald-500/20'
                                : 'bg-surface border border-border text-muted hover:text-foreground hover:border-emerald-500/30'
                            }`}
                          >
                            {d.short}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <label
                    htmlFor="onboarding-started-before-checkbox"
                    className="flex items-start gap-2.5 p-2.5 rounded-xl border border-border bg-surface-secondary/40 hover:bg-surface-secondary/70 transition-colors cursor-pointer select-none"
                  >
                    <input
                      id="onboarding-started-before-checkbox"
                      type="checkbox"
                      checked={startedBefore}
                      onChange={(e) => setStartedBefore(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-border text-emerald-500 focus:ring-emerald-400 accent-emerald-500 shrink-0 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-foreground block">
                        Comencé antes de hoy
                      </span>
                      <span className="text-[11px] text-muted">
                        Ajusta el inicio al día seleccionado de la semana en curso (retroactivo) en lugar de la próxima semana.
                      </span>
                    </div>
                  </label>

                  {computedRange && (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-secondary/50">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-foreground truncate">
                          {computedRange.formattedText}
                        </div>
                        <div className="text-[11px] text-muted flex items-center gap-2 mt-0.5">
                          <span className="tabular-nums font-semibold">{durationWeeks}&nbsp;semanas ({durationWeeks * 7}&nbsp;días)</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">{computedRange.statusText}</span>
                        </div>
                      </div>
                    </div>
                  )}

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
                    <label className="text-xs font-bold text-foreground block">
                      Selecciona el día para configurar su rutina:
                    </label>
                    <div
                      role="tablist"
                      aria-label="Días para configurar rutina"
                      className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border border-border bg-surface-secondary/50 max-w-fit"
                    >
                      {selectedDaysOfWeek.map((dayId) => {
                        const dayObj = DAYS_OF_WEEK.find(d => d.id === dayId);
                        const isActive = activeDayTab === dayId;
                        return (
                          <button
                            key={dayId}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setActiveDayTab(dayId)}
                            className={`shrink-0 font-bold text-xs h-8 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                              isActive
                                ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                                : 'bg-surface border border-border text-muted hover:text-foreground hover:border-emerald-500/30'
                            }`}
                          >
                            <span>{dayObj ? dayObj.name : `Día ${dayId}`}</span>
                          </button>
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

            <ModalFooter className="border-t border-border pt-3.5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {currentStep > 1 && (
                  <Button variant="ghost" size="sm" onPress={handleBack} className="font-bold flex-1 sm:flex-initial">
                    <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
                    <span>Atrás</span>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onPress={onClose} className="font-bold flex-1 sm:flex-initial">
                  Cancelar
                </Button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {currentStep < 3 ? (
                  <Button variant="primary" size="sm" onPress={handleNext} className="font-bold w-full sm:w-auto shadow-sm">
                    <span>Siguiente</span>
                    <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    isDisabled={saving}
                    onPress={handleSubmit}
                    className="font-bold w-full sm:w-auto min-w-0 shadow-sm"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin shrink-0 mr-1" aria-hidden="true" />
                        <span className="truncate">Creando Cliente y Mesociclo…</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 shrink-0 mr-1" aria-hidden="true" />
                        <span className="truncate">Crear Cliente y Mesociclo</span>
                      </>
                    )}
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
