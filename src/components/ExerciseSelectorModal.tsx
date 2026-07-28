import React, { useState, useEffect } from 'react';
import { ModalDialog, ModalHeader, ModalBody, ModalFooter, Input, Button, Chip, Card, CardContent } from '@heroui/react';
import { Search, Check, Dumbbell, Filter, X } from 'lucide-react';
import { getExercises } from '../lib/api';

const MUSCLE_GROUPS = [
  'Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 
  'Cuádriceps', 'Femorales', 'Glúteos', 'Gemelos', 'Abdomen'
];

export default function ExerciseSelectorModal({ isOpen, onClose, onAddExercises }) {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);
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

  const toggleMuscleGroup = (group) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const toggleSelectExercise = (exercise) => {
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <ModalDialog className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl p-4 flex flex-col">
        <ModalHeader className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Seleccionar Ejercicios</h3>
              <p className="text-xs text-slate-400 font-normal">Filtra por grupo muscular y agrega a la rutina</p>
            </div>
          </div>
          <Button isIconOnly size="sm" variant="light" onPress={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </ModalHeader>

        <ModalBody className="py-4 space-y-3 overflow-y-auto flex-1">
          <Input
            placeholder="Buscar ejercicio por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search className="w-4 h-4 text-slate-400" />}
            variant="bordered"
            size="sm"
          />

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3 text-emerald-400" /> Grupos Musculares:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {MUSCLE_GROUPS.map((group) => {
                const active = selectedMuscleGroups.includes(group);
                return (
                  <Chip
                    key={group}
                    onClick={() => toggleMuscleGroup(group)}
                    color={active ? "success" : "default"}
                    variant={active ? "solid" : "bordered"}
                    size="sm"
                    className="cursor-pointer font-semibold text-xs"
                  >
                    {group}
                  </Chip>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {loading ? (
              <div className="text-center py-8 text-slate-400 text-xs">Cargando biblioteca de ejercicios...</div>
            ) : exercisesList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">No se encontraron ejercicios con ese criterio.</div>
            ) : (
              exercisesList.map((exercise) => {
                const isSelected = selectedExerciseIds.some(item => item.id === exercise.id);
                return (
                  <Card
                    key={exercise.id}
                    isPressable
                    onPress={() => toggleSelectExercise(exercise)}
                    className={`transition-all ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white' 
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <CardContent className="p-3 flex flex-row items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold">{exercise.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          {exercise.muscle_groups && exercise.muscle_groups.map((mg, idx) => (
                            <Chip key={idx} size="sm" color="success" variant="flat" className="text-[10px]">
                              {mg}
                            </Chip>
                          ))}
                          {exercise.equipment && (
                            <Chip size="sm" variant="bordered" className="text-[10px] text-slate-400">
                              {exercise.equipment}
                            </Chip>
                          )}
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {selectedExerciseIds.length} ejercicio{selectedExerciseIds.length !== 1 ? 's' : ''} seleccionado{selectedExerciseIds.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <Button variant="flat" size="sm" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="success"
              size="sm"
              isDisabled={selectedExerciseIds.length === 0}
              onPress={handleConfirm}
              className="font-bold text-slate-950 shadow-md shadow-emerald-500/20"
            >
              Agregar a Rutina
            </Button>
          </div>
        </ModalFooter>
      </ModalDialog>
    </div>
  );
}
