import React from 'react';
import { Button, Chip } from '@heroui/react';
import { Dumbbell, Users, Plus, UserCheck, LogOut } from 'lucide-react';
import { getCurrentTrainer, logoutTrainer } from '../lib/pocketbase';
import { Client } from '../types';

interface HeaderProps {
  clients?: Client[];
  selectedClient?: Client | null;
  onSelectClient: (client: Client) => void;
  onOpenNewClientModal: () => void;
  onOpenLoginModal: () => void;
}

export default function Header({ 
  clients = [], 
  selectedClient, 
  onSelectClient, 
  onOpenNewClientModal,
  onOpenLoginModal 
}: HeaderProps) {
  const currentTrainer = getCurrentTrainer();

  return (
    <header className="border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl border flex items-center justify-center">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg tracking-tight font-heading">
                Venefit
              </h1>
              <Chip variant="soft" size="sm">
                Pro
              </Chip>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Plataforma para Entrenadores</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedClient ? selectedClient.id : ''}
              onChange={(e) => {
                const found = clients.find(c => c.id === e.target.value);
                if (found) onSelectClient(found);
              }}
              className="appearance-none text-xs md:text-sm font-medium rounded-xl px-3 py-2 pr-8 focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[220px] truncate"
            >
              {clients.length === 0 ? (
                <option value="">No hay clientes</option>
              ) : (
                clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    👤 {c.name}
                  </option>
                ))
              )}
            </select>
            <Users className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Button
            variant="primary"
            size="sm"
            onPress={onOpenNewClientModal}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Cliente</span>
          </Button>

          {currentTrainer ? (
            <div title={`Sesión activa: ${currentTrainer.email}`}>
              <Button
                size="sm"
                variant="outline"
                onPress={() => logoutTrainer()}
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden md:inline truncate max-w-[100px]">
                  {currentTrainer.name || currentTrainer.email.split('@')[0]}
                </span>
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onPress={onOpenLoginModal}
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
