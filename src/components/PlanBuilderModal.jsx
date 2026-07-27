import React, { useState } from 'react';
import { X, Calendar, Plus, GripVertical, Trash2, ArrowUp, ArrowDown, CheckCircle2 } from 'lucide-react';
import ExerciseSelectorModal from './ExerciseSelectorModal';
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

  if (!isOpen) return null;

  const setPresetDuration = (days) => {
    const start = new Date(startDateStr + 'T00:00:00');
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    setEndDateStr(formatDateISO(end));
  };

  const toggleDaySelection = (dayId) => {
    if (selectedDaysOfWeek.includes(dayId)) {
      setSelectedDaysOfWeek(prev => prev.filter(d => d !== dayId));
    } else {
      setSelectedDaysOfWeek(prev => [...prev, dayId]);
      if (!dayRoutinesConfig[dayId]) {
        const dayInfo = DAYS_OF_WEEK.find(d => d.id === dayId);
        setDayRoutinesConfig(prev => ({
          ...prev,
          [dayId]: {
            routineName: `Rutina ${dayInfo.name}`,
            muscleGroups: [],
            exercises: []
          }
        }));
      }
      setActiveDayTab(dayId);
    }
  };

  const handleAddExercisesToCurrentDay = (newExercises) => {
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
  };

  const updateExerciseParam = (dayId, index, key, value) => {
    setDayRoutinesConfig(prev => {
      const dayConf = prev[dayId];
      const updatedEx = [...dayConf.exercises];
      updatedEx[index] = { ...updatedEx[index], [key]: value };
      return {
        ...prev,
        [dayId]: { ...dayConf, exercises: updatedEx }
      };
    });
  };

  const removeExerciseFromDay = (dayId, index) => {
    setDayRoutinesConfig(prev => {
      const dayConf = prev[dayId];
      const updatedEx = dayConf.exercises.filter((_, i) => i !== index);
      return {
        ...prev,
        [dayId]: { ...dayConf, exercises: updatedEx }
      };
    });
  };

  const moveExerciseOrder = (dayId, fromIndex, toIndex) => {
    setDayRoutinesConfig(prev => {
      const dayConf = prev[dayId];
      const exercises = [...dayConf.exercises];
      if (toIndex < 0 || toIndex >= exercises.length) return prev;
      const item = exercises.splice(fromIndex, 1)[0];
      exercises.splice(toIndex, 0, item);
      return {
        ...prev,
        [dayId]: { ...dayConf, exercises }
      };
    });
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e, toIndex) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex)) {
      moveExerciseOrder(activeDayTab, fromIndex, toIndex);
    }
  };

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

  const activeConfig = dayRoutinesConfig[activeDayTab] || { routineName: '', exercises: [] };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">Creador de Planes</h3>
              <p className="text-xs text-slate-400">Diseña rutinas y replícalas en el rango de fechas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nombre del Plan</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full bg-slate-900 text-white text-sm px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
                placeholder="Ej. Hipertrofia 12 Semanas"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Fecha de Inicio</label>
                <input
                  type="date"
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  className="w-full bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Fecha Final</label>
                <input
                  type="date"
                  value={endDateStr}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  className="w-full bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Atajos de Duración:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '1 Semana', days: 7 },
                  { label: '1 Mes (30 días)', days: 30 },
                  { label: '3 Meses (Trimestral)', days: 90 },
                  { label: '6 Meses (Semestral)', days: 180 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setPresetDuration(preset.days)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 text-xs rounded-lg font-semibold transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Días de la semana a entrenar:
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((d) => {
                const isSelected = selectedDaysOfWeek.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDaySelection(d.id)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {d.short}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDaysOfWeek.length > 0 && (
            <div className="border border-slate-800 rounded-xl bg-slate-950/40 p-3">
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-3 overflow-x-auto">
                {selectedDaysOfWeek.map((dayId) => {
                  const dayObj = DAYS_OF_WEEK.find(d => d.id === dayId);
                  const active = activeDayTab === dayId;
                  return (
                    <button
                      key={dayId}
                      type="button"
                      onClick={() => setActiveDayTab(dayId)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                      }`}
                    >
                      {dayObj.name}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Nombre de la Rutina de este día</label>
                  <input
                    type="text"
                    value={activeConfig.routineName || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDayRoutinesConfig(prev => ({
                        ...prev,
                        [activeDayTab]: { ...prev[activeDayTab], routineName: val }
                      }));
                    }}
                    className="w-full bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
                    placeholder="Ej. Pecho + Tríceps"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-slate-300">
                    Ejercicios ({activeConfig.exercises ? activeConfig.exercises.length : 0})
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsExerciseSelectorOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Agregar Ejercicio
                  </button>
                </div>

                <div className="space-y-2">
                  {(!activeConfig.exercises || activeConfig.exercises.length === 0) ? (
                    <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                      Presiona "Agregar Ejercicio" para armar la rutina de este día.
                    </div>
                  ) : (
                    activeConfig.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, idx)}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 space-y-2.5 transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="cursor-grab text-slate-500 hover:text-slate-300 p-1" title="Arrastrar para ordenar">
                              <GripVertical className="w-4 h-4" />
                            </span>
                            <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h5 className="text-xs sm:text-sm font-bold text-white">{ex.name}</h5>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveExerciseOrder(activeDayTab, idx, idx - 1)}
                              disabled={idx === 0}
                              className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30"
                              title="Subir orden"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveExerciseOrder(activeDayTab, idx, idx + 1)}
                              disabled={idx === activeConfig.exercises.length - 1}
                              className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30"
                              title="Bajar orden"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeExerciseFromDay(activeDayTab, idx)}
                              className="p-1 text-slate-500 hover:text-rose-400"
                              title="Eliminar de rutina"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Series</label>
                            <input
                              type="number"
                              min="1"
                              value={ex.target_sets}
                              onChange={(e) => updateExerciseParam(activeDayTab, idx, 'target_sets', e.target.value)}
                              className="w-full bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-800"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Reps Meta</label>
                            <input
                              type="text"
                              value={ex.target_reps}
                              onChange={(e) => updateExerciseParam(activeDayTab, idx, 'target_reps', e.target.value)}
                              className="w-full bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-800"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">RIR Meta</label>
                            <select
                              value={ex.target_rir}
                              onChange={(e) => updateExerciseParam(activeDayTab, idx, 'target_rir', e.target.value)}
                              className="w-full bg-slate-900 text-slate-200 px-1 py-1 rounded border border-slate-800"
                            >
                              <option value="0">RIR 0 (Fallo)</option>
                              <option value="1">RIR 1</option>
                              <option value="2">RIR 2</option>
                              <option value="3">RIR 3</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Descanso (s)</label>
                            <input
                              type="number"
                              step="15"
                              value={ex.target_rest_sec}
                              onChange={(e) => updateExerciseParam(activeDayTab, idx, 'target_rest_sec', e.target.value)}
                              className="w-full bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-800"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Peso & Unidad</label>
                            <div className="flex gap-1">
                              <input
                                type="number"
                                step="0.5"
                                value={ex.target_weight}
                                onChange={(e) => updateExerciseParam(activeDayTab, idx, 'target_weight', e.target.value)}
                                className="w-full bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-800"
                              />
                              <select
                                value={ex.weight_unit}
                                onChange={(e) => updateExerciseParam(activeDayTab, idx, 'weight_unit', e.target.value)}
                                className="bg-slate-900 text-emerald-400 font-bold px-1 rounded border border-slate-800"
                              >
                                <option value="kg">kg</option>
                                <option value="lb">lb</option>
                              </select>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAndReplicate}
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar y Replicar Plan'}
            </button>
          </div>
        </div>

      </div>

      <ExerciseSelectorModal
        isOpen={isExerciseSelectorOpen}
        onClose={() => setIsExerciseSelectorOpen(false)}
        onAddExercises={handleAddExercisesToCurrentDay}
      />
    </div>
  );
}
