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
      <ModalContainer size="md">
        <ModalDialog>
          <ModalHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus />
              <div>
                <ModalHeading>Nuevo Cliente</ModalHeading>
                <p className="text-xs font-normal">Ingresa los datos para registrar a tu atleta</p>
              </div>
            </div>
            <ModalCloseTrigger onClick={onClose} />
          </ModalHeader>

          <ModalBody className="gap-3">
            <Input
              placeholder="Nombre Completo *"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="tel"
              placeholder="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              placeholder="Objetivo Principal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Peso Actual (kg)"
              value={weight ? Number(weight) : undefined}
              onChange={(e) => setWeight(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Altura (cm)"
              value={height ? Number(height) : undefined}
              onChange={(e) => setHeight(e.target.value)}
            />

            <Input
              placeholder="Notas / Lesiones / Observaciones"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onPress={onClose} size="sm">
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              isDisabled={saving}
              onPress={handleSubmit}
            >
              <Save />
              <span>Guardar Cliente</span>
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
