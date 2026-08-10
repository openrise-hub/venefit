import React, { useState } from 'react';
import { ModalBackdrop, ModalContainer, ModalDialog, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalCloseTrigger, Input, Button } from '@heroui/react';
import { UserPlus, Save } from 'lucide-react';
import { createClient } from '../lib/api';
import { showToast } from '../lib/toastStore';

interface ClientManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: any) => void;
}

export default function ClientManagerModal({ isOpen, onClose, onClientCreated }: ClientManagerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('Hipertrofia Muscular y Fuerza');
  const [weight, setWeight] = useState('75.0');
  const [height, setHeight] = useState('175.0');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast('Ingresa el nombre del cliente', 'info');
      return;
    }

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

      onClientCreated(newClient);
      onClose();
    } catch (err) {
      console.error('[ClientManagerModal:handleSubmit] Failed to create client:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalBackdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContainer size="md" placement="center" className="p-3 sm:p-4 my-auto flex items-center justify-center">
        <ModalDialog className="w-full max-w-md mx-auto my-auto overflow-hidden">
          <ModalHeader className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3 min-w-0">
              <UserPlus className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <ModalHeading className="text-base font-bold truncate">Nuevo Cliente</ModalHeading>
                <p className="text-xs font-normal opacity-70 truncate">Ingresa los datos para registrar a tu cliente</p>
              </div>
            </div>
            <ModalCloseTrigger onClick={onClose} />
          </ModalHeader>

          <ModalBody className="py-5 space-y-4 max-h-[75vh] overflow-y-auto overflow-x-hidden">
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
                placeholder="Ej. Preferencias de horario, observaciones..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </ModalBody>

          <ModalFooter className="border-t pt-4 flex justify-end gap-2.5">
            <Button variant="ghost" onPress={onClose} size="sm">
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              isDisabled={saving}
              onPress={handleSubmit}
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cliente</span>
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
