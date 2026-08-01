import React, { useState, useEffect } from 'react';
import { ModalBackdrop, ModalContainer, ModalDialog, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalCloseTrigger, Input, Button, Chip, Card, CardContent } from '@heroui/react';
import { Check, Dumbbell } from 'lucide-react';
import { getExercises } from '../lib/api';

const MUSCLE_GROUPS = [
  'Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 
  'Cuádriceps', 'Femorales', 'Glúteos', 'Gemelos', 'Abdomen'
];

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercises: (exercises: any[]) => void;
}

export default function ExerciseSelectorModal({ isOpen, onClose, onAddExercises }: ExerciseSelectorModalProps) {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
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
  }, [isOpen, selectedMuscleGroups, debouncedQuery]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await getExercises(selectedMuscleGroups, debouncedQuery);
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
      <ModalContainer size="lg">
        <ModalDialog>
          <ModalHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell />
              <div>
                <ModalHeading>Seleccionar Ejercicios</ModalHeading>
                <p className="text-xs font-normal">Filtra por grupo muscular y agrega a la rutina</p>
              </div>
            </div>
            <ModalCloseTrigger onClick={onClose} />
          </ModalHeader>

          <ModalBody className="gap-3">
            <Input
              placeholder="Buscar ejercicio por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex flex-wrap gap-1.5">
              {MUSCLE_GROUPS.map((group) => {
                const active = selectedMuscleGroups.includes(group);
                return (
                  <Chip
                    key={group}
                    onClick={() => toggleMuscleGroup(group)}
                    variant={active ? "primary" : "soft"}
                    size="sm"
                  >
                    {group}
                  </Chip>
                );
              })}
            </div>

            <div className="space-y-2">
              {loading ? (
                <p className="text-center text-xs">Cargando biblioteca de ejercicios...</p>
              ) : exercisesList.length === 0 ? (
                <p className="text-center text-xs">No se encontraron ejercicios.</p>
              ) : (
                exercisesList.map((exercise) => {
                  const isSelected = selectedExerciseIds.some(item => item.id === exercise.id);
                  return (
                    <div key={exercise.id} onClick={() => toggleSelectExercise(exercise)}>
                      <Card>
                        <CardContent className="flex flex-row items-center justify-between">
                          <div>
                            <h4>{exercise.name}</h4>
                            <div className="flex gap-1 mt-1">
                              {exercise.muscle_groups && exercise.muscle_groups.map((mg: string, idx: number) => (
                                <Chip key={idx} size="sm" variant="soft">
                                  {mg}
                                </Chip>
                              ))}
                            </div>
                          </div>
                          {isSelected && <Check />}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })
              )}
            </div>
          </ModalBody>

          <ModalFooter className="flex justify-between items-center">
            <p className="text-xs">
              {selectedExerciseIds.length} seleccionado{selectedExerciseIds.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                isDisabled={selectedExerciseIds.length === 0}
                onPress={handleConfirm}
              >
                Agregar a Rutina
              </Button>
            </div>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
