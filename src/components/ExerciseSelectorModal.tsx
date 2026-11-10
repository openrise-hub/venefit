import React, { useState, useEffect } from 'react';
import { ModalBackdrop, ModalContainer, ModalDialog, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalCloseTrigger, Button, Chip, Card, CardContent } from '@heroui/react';
import { Check, Dumbbell, X, Search } from 'lucide-react';
import { getExercises } from '../lib/api';

const MUSCLE_GROUPS = [
  'Pectoral',
  'Hombro',
  'Espalda',
  'Bíceps',
  'Tríceps',
  'Abdomen',
  'Cuádriceps',
  'Isquiotibiales',
  'Aductores',
  'Glúteo',
  'Gemelos',
  'Antebrazo'
];

const MODALITY_OPTIONS = ['Todos', 'Peso Libre', 'Poleas', 'Máquinas'];

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercises: (exercises: any[]) => void;
}

export default function ExerciseSelectorModal({ isOpen, onClose, onAddExercises }: ExerciseSelectorModalProps) {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedModality, setSelectedModality] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [exercisesList, setExercisesList] = useState<any[]>([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      loadExercises();
    }
  }, [isOpen, selectedMuscleGroups, selectedModality, debouncedQuery]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await getExercises(selectedMuscleGroups, selectedModality, debouncedQuery);
      setExercisesList(data);
    } catch (e) {
      console.error('[ExerciseSelectorModal] Failed to load exercises:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleMuscleGroup = (group: string) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const toggleSelectExercise = (exercise: any) => {
    setSelectedExerciseIds(prev => {
      const exists = prev.some(item => item.id === exercise.id);
      if (exists) {
        return prev.filter(item => item.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedExerciseIds.length > 0) {
      onAddExercises(selectedExerciseIds);
      setSelectedExerciseIds([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBackdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContainer size="lg" placement="center" className="p-2 sm:p-4">
        <ModalDialog className="w-full max-w-2xl mx-auto overflow-hidden border border-border shadow-2xl bg-surface">
          <ModalHeader className="flex items-start sm:items-center justify-between border-b border-border pb-3.5 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Dumbbell className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <ModalHeading className="text-sm sm:text-base font-extrabold text-foreground">
                  Catálogo de Ejercicios
                </ModalHeading>
                <p className="text-[11px] sm:text-xs font-medium text-muted truncate">
                  Filtra por grupo muscular, modalidad y agrega a la rutina
                </p>
              </div>
            </div>
            <ModalCloseTrigger onClick={onClose} aria-label="Cerrar catálogo de ejercicios" />
          </ModalHeader>

          <ModalBody className="py-4 sm:py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                placeholder="Buscar ejercicio por nombre…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar ejercicio por nombre"
                className="w-full h-10 pl-10 pr-9 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Modalidad</span>
                {selectedModality !== 'Todos' && (
                  <button
                    type="button"
                    onClick={() => setSelectedModality('Todos')}
                    className="text-[11px] text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Restablecer
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {MODALITY_OPTIONS.map((modality) => {
                  const active = selectedModality === modality;
                  return (
                    <Chip
                      key={modality}
                      onClick={() => setSelectedModality(modality)}
                      variant={active ? "primary" : "soft"}
                      size="sm"
                      className={`cursor-pointer font-bold text-xs ${active ? 'shadow-xs' : ''}`}
                    >
                      {modality}
                    </Chip>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Grupo Muscular</span>
                {selectedMuscleGroups.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedMuscleGroups([])}
                    className="text-[11px] text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Limpiar filtros ({selectedMuscleGroups.length})
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {MUSCLE_GROUPS.map((group) => {
                  const active = selectedMuscleGroups.includes(group);
                  return (
                    <Chip
                      key={group}
                      onClick={() => toggleMuscleGroup(group)}
                      variant={active ? "primary" : "soft"}
                      size="sm"
                      className={`cursor-pointer font-bold text-xs ${active ? 'shadow-xs' : ''}`}
                    >
                      {group}
                    </Chip>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
              {loading ? (
                <p className="text-center py-6 text-xs font-medium text-muted" role="status" aria-live="polite">
                  Cargando catálogo de ejercicios…
                </p>
              ) : exercisesList.length === 0 ? (
                <p className="text-center py-6 text-xs font-medium text-muted">
                  No se encontraron ejercicios con los filtros seleccionados.
                </p>
              ) : (
                exercisesList.map((exercise) => {
                  const isSelected = selectedExerciseIds.some(item => item.id === exercise.id);
                  return (
                    <div
                      key={exercise.id}
                      role="checkbox"
                      tabIndex={0}
                      aria-checked={isSelected}
                      aria-label={`Seleccionar ejercicio ${exercise.name}, ${exercise.primary_muscle || ''}`}
                      onClick={() => toggleSelectExercise(exercise)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleSelectExercise(exercise);
                        }
                      }}
                      className="cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2 rounded-2xl"
                    >
                      <Card className={`transition-all border ${isSelected ? 'border-emerald-400 ring-1 ring-emerald-400 bg-surface' : 'border-border bg-surface hover:border-foreground/30'}`}>
                        <CardContent className="p-3 sm:p-3.5 flex flex-row items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{exercise.name}</h4>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              {exercise.primary_muscle && (
                                <Chip size="sm" variant="primary" className="text-[10px] font-semibold">
                                  {exercise.primary_muscle}
                                </Chip>
                              )}
                              {exercise.modality && (
                                <Chip size="sm" variant="soft" className="text-[10px] font-semibold">
                                  {exercise.modality}
                                </Chip>
                              )}
                              {exercise.equipment && (
                                <Chip size="sm" variant="soft" className="text-[10px] opacity-80">
                                  {exercise.equipment}
                                </Chip>
                              )}
                            </div>
                            {exercise.description && (
                              <p className="text-[11px] text-muted mt-1 line-clamp-1 leading-relaxed">
                                {exercise.description}
                              </p>
                            )}
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-emerald-400 stroke-[3] shrink-0" aria-hidden="true" />}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })
              )}
            </div>
          </ModalBody>

          <ModalFooter className="border-t border-border pt-3.5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
            <span className="text-xs font-bold text-foreground/80 text-center sm:text-left tabular-nums" role="status" aria-live="polite">
              {selectedExerciseIds.length}&nbsp;ejercicio{selectedExerciseIds.length !== 1 ? 's' : ''} seleccionado{selectedExerciseIds.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onPress={onClose} className="font-bold flex-1 sm:flex-initial">
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                isDisabled={selectedExerciseIds.length === 0}
                onPress={handleConfirm}
                className="font-bold flex-1 sm:flex-initial min-w-0"
              >
                Agregar ({selectedExerciseIds.length})
              </Button>
            </div>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
