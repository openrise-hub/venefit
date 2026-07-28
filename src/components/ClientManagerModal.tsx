import React, { useState } from 'react';
import { ModalDialog, ModalHeader, ModalBody, ModalFooter, Input, Button } from '@heroui/react';
import { UserPlus, Save, X } from 'lucide-react';
import { createClient } from '../lib/api';
import { showToast } from '../lib/toastStore';

export default function ClientManagerModal({ isOpen, onClose, onClientCreated }) {
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
        current_weight: parseFloat(weight || 0),
        height: parseFloat(height || 0),
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <ModalDialog className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-lg rounded-2xl shadow-2xl p-4">
        <ModalHeader className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Nuevo Cliente</h3>
              <p className="text-xs text-slate-400 font-normal">Ingresa los datos para registrar a tu atleta</p>
            </div>
          </div>
          <Button isIconOnly size="sm" variant="light" onPress={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </ModalHeader>

        <ModalBody className="py-4 space-y-3">
          <Input
            label="Nombre Completo *"
            placeholder="Ej. Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="bordered"
            isRequired
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="email"
              label="Correo Electrónico"
              placeholder="juan@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="bordered"
            />
            <Input
              type="tel"
              label="Teléfono"
              placeholder="+56 9 1234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              variant="bordered"
            />
          </div>

          <Input
            label="Objetivo Principal"
            placeholder="Ej. Ganancia muscular"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            variant="bordered"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              step="0.1"
              label="Peso Actual (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              variant="bordered"
            />
            <Input
              type="number"
              step="1"
              label="Altura (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              variant="bordered"
            />
          </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Notas / Lesiones / Observaciones
                </label>
                <textarea
                  placeholder="Ej. Lesión previa de rodilla derecha..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 text-slate-100 text-xs p-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>
        </ModalBody>

        <ModalFooter className="border-t border-slate-800 pt-3">
          <Button variant="flat" onPress={onClose} size="sm">
            Cancelar
          </Button>
          <Button
            color="success"
            size="sm"
            className="font-extrabold text-slate-950 shadow-md shadow-emerald-500/20"
            isLoading={saving}
            onPress={handleSubmit}
            startContent={!saving && <Save className="w-4 h-4" />}
          >
            Guardar Cliente
          </Button>
        </ModalFooter>
      </ModalDialog>
    </div>
  );
}
