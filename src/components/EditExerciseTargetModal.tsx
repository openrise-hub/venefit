import React, { useState } from 'react';
import {
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalFooter,
  ModalCloseTrigger,
  Button
} from '@heroui/react';
import { Settings2, Save, X, Timer, Target } from 'lucide-react';
import { RoutineExercise } from '../types';

const RIR_OPTIONS = [
  { value: 0, label: 'RIR 0 (Fallo muscular)' },
  { value: 1, label: 'RIR 1' },
  { value: 2, label: 'RIR 2' },
  { value: 3, label: 'RIR 3' },
  { value: 4, label: 'RIR 4+' }
];

const REST_TIME_OPTIONS = [
  { value: 45, label: '45 segundos' },
  { value: 60, label: '60 segundos (1 min)' },
  { value: 75, label: '75 segundos' },
  { value: 90, label: '90 segundos (1.5 min)' },
  { value: 120, label: '120 segundos (2 min)' },
  { value: 150, label: '150 segundos (2.5 min)' },
  { value: 180, label: '180 segundos (3 min)' },
  { value: 240, label: '240 segundos (4 min)' }
];

interface EditExerciseTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  exItem: RoutineExercise;
  onSave: (routineExId: string, updates: Partial<RoutineExercise>) => Promise<void>;
}

export default function EditExerciseTargetModal({
  isOpen,
  onClose,
  exItem,
  onSave
}: EditExerciseTargetModalProps) {
  const [targetSets, setTargetSets] = useState(exItem.target_sets || 3);
  const [targetReps, setTargetReps] = useState(exItem.target_reps || '10-12');
  const [targetWeight, setTargetWeight] = useState(exItem.target_weight || 0);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>(exItem.weight_unit || 'kg');
  const [targetRir, setTargetRir] = useState(exItem.target_rir ?? 2);
  const [targetRestSec, setTargetRestSec] = useState(exItem.target_rest_sec || 90);
  const [notes, setNotes] = useState(exItem.notes || '');
  const [saving, setSaving] = useState(false);

  const exerciseName =
    exItem.expandedExercise?.name ||
    (typeof exItem.exercise === 'object' ? (exItem.exercise as any).name : 'Ejercicio');

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await onSave(exItem.id, {
        target_sets: Number(targetSets) || 3,
        target_reps: String(targetReps || '10-12'),
        target_weight: Number(targetWeight) || 0,
        weight_unit: weightUnit,
        target_rir: Number(targetRir),
        target_rest_sec: Number(targetRestSec) || 90,
        notes: notes.trim()
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBackdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContainer size="md" placement="center" className="p-3 sm:p-4">
        <ModalDialog className="w-full max-w-lg mx-auto overflow-hidden">
          <ModalHeader className="flex items-center justify-between border-b pb-3.5 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Settings2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <ModalHeading className="text-sm sm:text-base font-bold text-foreground truncate">
                  Editar Metas del Ejercicio
                </ModalHeading>
                <p className="text-[11px] font-medium text-foreground/70 truncate">
                  {exerciseName}
                </p>
              </div>
            </div>
            <ModalCloseTrigger onClick={onClose} />
          </ModalHeader>

          <form onSubmit={handleFormSubmit}>
            <ModalBody className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-foreground/80 block">
                    Series Objetivo
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={targetSets}
                    onChange={(e) => setTargetSets(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full h-9 rounded-xl border border-border px-3 text-xs font-bold bg-background focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-foreground/80 block">
                    Rango de Repeticiones
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 8-10, 12, Fallo"
                    value={targetReps}
                    onChange={(e) => setTargetReps(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border px-3 text-xs font-bold bg-background focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-foreground/80 block">
                    Peso de Referencia ({weightUnit})
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={targetWeight || ''}
                      onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                      className="w-full h-9 rounded-xl border border-border px-3 text-xs font-bold bg-background focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0"
                    />
                    <button
                      type="button"
                      onClick={() => setWeightUnit(u => u === 'kg' ? 'lb' : 'kg')}
                      className="h-9 px-2.5 text-xs font-bold rounded-xl border border-border hover:bg-foreground/5 text-emerald-400 shrink-0"
                    >
                      {weightUnit}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-foreground/80 block">
                    RIR Objetivo
                  </label>
                  <select
                    value={targetRir}
                    onChange={(e) => setTargetRir(parseInt(e.target.value, 10))}
                    className="w-full h-9 rounded-xl border border-border px-2 text-xs font-semibold bg-background focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                  >
                    {RIR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground/80 block flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tiempo de Descanso entre Series</span>
                </label>
                <select
                  value={targetRestSec}
                  onChange={(e) => setTargetRestSec(parseInt(e.target.value, 10))}
                  className="w-full h-9 rounded-xl border border-border px-2 text-xs font-semibold bg-background focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  {REST_TIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground/80 block">
                  Indicaciones Técnicas / Notas del Entrenador
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Pausa de 1s en contracción, mantener escápulas retraídas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-border p-2.5 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>
            </ModalBody>

            <ModalFooter className="border-t pt-3 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isDisabled={saving}
                className="font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                <Save className="w-4 h-4 mr-1" />
                <span>{saving ? 'Guardando...' : 'Guardar Metas'}</span>
              </Button>
            </ModalFooter>
          </form>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}

