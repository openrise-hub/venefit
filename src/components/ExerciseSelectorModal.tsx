import React, { useState, useEffect } from 'react';
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
  Chip,
  Card,
  CardContent
} from '@heroui/react';
import { Check, Dumbbell } from 'lucide-react';
import { getExercises } from '../lib/api';
import { MUSCLE_GROUPS, EQUIPMENT_TYPES, EquipmentType } from '../lib/exercisesCatalog';

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercises: (exercises: any[]) => void;
}

export default function ExerciseSelectorModal({ isOpen, onClose, onAddExercises }: ExerciseSelectorModalProps) {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType>('Todos');
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
  }, [isOpen, selectedMuscleGroups, selectedEquipment, debouncedQuery]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await getExercises(selectedMuscleGroups, selectedEquipment, debouncedQuery);
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
      const exists = prev.some(item => item.id === exercise.id || item.name === exercise.name);
      if (exists) {
        return prev.filter(item => item.id !== exercise.id && item.name !== exercise.name);
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
        <ModalDialog className="w-full max-w-2xl mx-auto overflow-hidden">
          <ModalHeader className="flex items-start sm:items-center justify-between border-b pb-3.5 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Dumbbell className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <ModalHeading className="text-sm sm:text-base font-bold text-foreground">Catálogo de Ejercicios</ModalHeading>
                <p className="text-[11px] sm:text-xs font-medium text-foreground/80 truncate">Filtra por grupo muscular, modalidad de equipo o busca por nombre</p>
              </div>
            </div>
            <ModalCloseTrigger onClick={onClose} />
          </ModalHeader>

          <ModalBody className="py-4 sm:py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <Input
              placeholder="Buscar ejercicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-foreground block">Modalidad / Equipamiento:</label>
              <div className="flex flex-wrap gap-1.5">
                {EQUIPMENT_TYPES.map((equip) => {
                  const isSelected = selectedEquipment === equip;
                  return (
                    <Button
                      key={equip}
                      size="sm"
                      variant={isSelected ? "primary" : "outline"}
                      className="font-bold text-xs h-7 px-2.5"
                      onPress={() => setSelectedEquipment(equip)}
                    >
                      {equip}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-foreground block">Grupos Musculares:</label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-24 overflow-y-auto p-1 border rounded-xl">
                {MUSCLE_GROUPS.map((group) => {
                  const active = selectedMuscleGroups.includes(group);
                  return (
                    <Chip
                      key={group}
                      onClick={() => toggleMuscleGroup(group)}
                      variant={active ? "primary" : "soft"}
                      size="sm"
                      className="cursor-pointer font-bold text-xs h-6"
                    >
                      {group}
                    </Chip>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
              {loading ? (
                <p className="text-center py-6 text-xs font-medium text-foreground/70">Cargando biblioteca de ejercicios...</p>
              ) : exercisesList.length === 0 ? (
                <p className="text-center py-6 text-xs font-medium text-foreground/70">No se encontraron ejercicios con ese criterio.</p>
              ) : (
                exercisesList.map((exercise) => {
                  const isSelected = selectedExerciseIds.some(item => item.id === exercise.id || item.name === exercise.name);
                  return (
                    <div key={exercise.id || exercise.name} onClick={() => toggleSelectExercise(exercise)} className="cursor-pointer">
                      <Card className={`transition-all ${isSelected ? 'border-primary ring-1 ring-primary' : ''}`}>
                        <CardContent className="p-3 sm:p-3.5 flex flex-row items-center justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-foreground">{exercise.name}</h4>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              {exercise.equipment && (
                                <Chip size="sm" variant="soft" className="text-[10px] font-bold border border-emerald-500/40 text-emerald-400">
                                  {exercise.equipment}
                                </Chip>
                              )}
                              {exercise.muscle_groups && exercise.muscle_groups.map((mg: string, idx: number) => (
                                <Chip key={idx} size="sm" variant="soft" className="text-[10px] font-medium">
                                  {mg}
                                </Chip>
                              ))}
                            </div>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-emerald-400 stroke-[3] shrink-0" />}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })
              )}
            </div>
          </ModalBody>

          <ModalFooter className="border-t pt-3.5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
            <span className="text-xs font-bold text-foreground/80 text-center sm:text-left">
              {selectedExerciseIds.length} ejercicio{selectedExerciseIds.length !== 1 ? 's' : ''} seleccionado{selectedExerciseIds.length !== 1 ? 's' : ''}
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
