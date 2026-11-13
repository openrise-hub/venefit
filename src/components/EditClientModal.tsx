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
  Button
} from '@heroui/react';
import { UserCheck, RefreshCw } from 'lucide-react';
import { Client } from '../types';
import { updateClient } from '../lib/api';
import { showToast } from '../lib/toastStore';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onClientUpdated: (updatedClient: Client) => void;
}

export default function EditClientModal({
  isOpen,
  onClose,
  client,
  onClientUpdated
}: EditClientModalProps) {
  const [name, setName] = useState(client.name || '');
  const [email, setEmail] = useState(client.email || '');
  const [phone, setPhone] = useState(client.phone || '');
  const [goal, setGoal] = useState(client.goal || '');
  const [weight, setWeight] = useState(client.current_weight != null && client.current_weight > 0 ? String(client.current_weight) : '');
  const [height, setHeight] = useState(client.height != null && client.height > 0 ? String(client.height) : '');
  const [notes, setNotes] = useState(client.notes || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(client.name || '');
      setEmail(client.email || '');
      setPhone(client.phone || '');
      setGoal(client.goal || '');
      setWeight(client.current_weight != null && client.current_weight > 0 ? String(client.current_weight) : '');
      setHeight(client.height != null && client.height > 0 ? String(client.height) : '');
      setNotes(client.notes || '');
    }
  }, [isOpen, client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('El nombre del cliente es obligatorio', 'info');
      return;
    }

    try {
      setSaving(true);
      const updated = await updateClient(client.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        goal: goal.trim(),
        current_weight: weight ? parseFloat(weight) : 0,
        height: height ? parseFloat(height) : 0,
        notes: notes.trim()
      });

      if (updated) {
        onClientUpdated(updated);
        onClose();
      }
    } catch (err) {
      console.error('[EditClientModal] Error saving client details:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBackdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContainer size="lg" placement="center" className="p-2 sm:p-4">
        <ModalDialog className="w-full max-w-xl mx-auto overflow-hidden border border-border shadow-2xl bg-surface rounded-2xl">
          <ModalHeader className="flex items-start sm:items-center justify-between border-b border-border pb-3.5 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                <UserCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <ModalHeading className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
                  Editar Datos del Cliente
                </ModalHeading>
                <p className="text-[11px] sm:text-xs font-medium text-muted truncate">
                  Actualiza el perfil, métricas corporales y notas de seguimiento
                </p>
              </div>
            </div>
            <ModalCloseTrigger onClick={onClose} aria-label="Cerrar modal de edición" />
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <ModalBody className="py-4 sm:py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <div className="space-y-1.5 min-w-0">
                <label htmlFor="edit-client-name" className="text-xs font-bold text-foreground block">
                  Nombre Completo <span className="text-emerald-500">*</span>
                </label>
                <input
                  id="edit-client-name"
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="space-y-1.5 min-w-0">
                  <label htmlFor="edit-client-email" className="text-xs font-bold text-foreground block">
                    Correo Electrónico
                  </label>
                  <input
                    id="edit-client-email"
                    type="email"
                    placeholder="juan@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <label htmlFor="edit-client-phone" className="text-xs font-bold text-foreground block">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    id="edit-client-phone"
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
                  />
                </div>
              </div>

              {/* Goal */}
              <div className="space-y-1.5 min-w-0">
                <label htmlFor="edit-client-goal" className="text-xs font-bold text-foreground block">
                  Objetivo Principal
                </label>
                <input
                  id="edit-client-goal"
                  type="text"
                  placeholder="Ej. Hipertrofia y Ganancia de Fuerza"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs"
                />
              </div>

              {/* Weight & Height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="space-y-1.5 min-w-0">
                  <label htmlFor="edit-client-weight" className="text-xs font-bold text-foreground block">
                    Peso Actual (kg)
                  </label>
                  <input
                    id="edit-client-weight"
                    type="number"
                    step="0.1"
                    placeholder="75.0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs tabular-nums"
                  />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <label htmlFor="edit-client-height" className="text-xs font-bold text-foreground block">
                    Altura (cm)
                  </label>
                  <input
                    id="edit-client-height"
                    type="number"
                    step="0.5"
                    placeholder="175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs tabular-nums"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5 min-w-0">
                <label htmlFor="edit-client-notes" className="text-xs font-bold text-foreground block">
                  Notas de Coaching & Consideraciones Médicas
                </label>
                <textarea
                  id="edit-client-notes"
                  rows={3}
                  placeholder="Antecedentes de lesiones, preferencias, disponibilidad horaria o indicaciones específicas…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-surface text-foreground font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-background transition-colors shadow-2xs resize-none"
                />
              </div>
            </ModalBody>

            <ModalFooter className="border-t border-border pt-3.5 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="ghost"
                onPress={onClose}
                isDisabled={saving}
                className="font-bold text-xs h-9 sm:h-10 px-4"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isDisabled={saving}
                className="font-bold text-xs sm:text-sm h-9 sm:h-10 px-5 shadow-xs"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" aria-hidden="true" />
                    <span>Guardando…</span>
                  </>
                ) : (
                  <span>Guardar Cambios</span>
                )}
              </Button>
            </ModalFooter>
          </form>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
