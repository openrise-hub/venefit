import React, { useState, useEffect } from 'react';
import { Search, X, Check, Dumbbell, Filter } from 'lucide-react';
import { getExercises } from '../lib/api';

const MUSCLE_GROUPS = [
  'Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 
  'Cuádriceps', 'Femorales', 'Glúteos', 'Gemelos', 'Abdomen'
];

export default function ExerciseSelectorModal({ isOpen, onClose, onAddExercises }) {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadExercises();
    }
  }, [isOpen, selectedMuscleGroups, searchQuery]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await getExercises(selectedMuscleGroups, searchQuery);
      setExercisesList(data);
    } catch (e) {
      console.error('Error cargando ejercicios', e);
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* CABECERA */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Seleccionar Ejercicios</h3>
              <p className="text-xs text-slate-400">Filtra por grupo muscular y agrega a la rutina</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar ejercicio por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* CHIPS GRUPOS MUSCULARES */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3 text-emerald-400" /> Grupos Musculares:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {MUSCLE_GROUPS.map((group) => {
                const active = selectedMuscleGroups.includes(group);
                return (
                  <button
                    key={group}
                    onClick={() => toggleMuscleGroup(group)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      active 
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20' 
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {group}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* LISTA DE EJERCICIOS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center py-8 text-slate-400 text-xs">Cargando biblioteca de ejercicios...</div>
          ) : exercisesList.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">No se encontraron ejercicios con ese criterio.</div>
          ) : (
            exercisesList.map((exercise) => {
              const isSelected = selectedExerciseIds.some(item => item.id === exercise.id);
              return (
                <div
                  key={exercise.id}
                  onClick={() => toggleSelectExercise(exercise)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white' 
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold">{exercise.name}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      {exercise.muscle_groups.map((mg, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-medium">
                          {mg}
                        </span>
                      ))}
                      {exercise.equipment && (
                        <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                          {exercise.equipment}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                    isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold' : 'border-slate-700'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BOTONERA INFERIOR */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {selectedExerciseIds.length} ejercicio{selectedExerciseIds.length !== 1 ? 's' : ''} seleccionado{selectedExerciseIds.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedExerciseIds.length === 0}
              className="px-4 py-2 bg-emerald-500 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              Agregar a Rutina
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
