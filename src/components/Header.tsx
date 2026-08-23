import React, { useState, useEffect } from 'react';
import { Button, Chip } from '@heroui/react';
import { Dumbbell, Users, Plus, UserCheck, LogOut, Sun, Moon, Laptop } from 'lucide-react';
import { getCurrentTrainer, logoutTrainer } from '../lib/pocketbase';
import { getThemePreference, setThemePreference, ThemePreference } from '../lib/theme';
import { Client } from '../types';

interface HeaderProps {
  clients?: Client[];
  selectedClient?: Client | null;
  onSelectClient: (client: Client) => void;
  onOpenNewClientModal: () => void;
}

export default function Header({ 
  clients = [], 
  selectedClient, 
  onSelectClient, 
  onOpenNewClientModal 
}: HeaderProps) {
  const currentTrainer = getCurrentTrainer();
  const [themePref, setThemePref] = useState<ThemePreference>('system');

  useEffect(() => {
    setThemePref(getThemePreference());
  }, []);

  const cycleTheme = () => {
    const next: ThemePreference =
      themePref === 'system' ? 'dark' : themePref === 'dark' ? 'light' : 'system';
    setThemePref(next);
    setThemePreference(next);
  };

  return (
    <header className="border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl border flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
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
            <p className="text-xs opacity-60 hidden sm:block">Plataforma para Entrenadores</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <select
              value={selectedClient ? selectedClient.id : ''}
              onChange={(e) => {
                const found = clients.find(c => c.id === e.target.value);
                if (found) onSelectClient(found);
              }}
              className="appearance-none text-xs sm:text-sm font-medium rounded-xl px-3 py-2 pr-8 border cursor-pointer max-w-[140px] sm:max-w-[200px] truncate focus:outline-none bg-transparent"
            >
              {clients.length === 0 ? (
                <option value="" disabled selected>
                  Sin clientes
                </option>
              ) : (
                clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
            <Users className="w-4 h-4 opacity-60 absolute right-2.5 pointer-events-none" />
          </div>

          <Button
            variant="primary"
            size="sm"
            onPress={onOpenNewClientModal}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Cliente</span>
          </Button>

          <div title={`Tema: ${themePref === 'system' ? 'Sistema' : themePref === 'dark' ? 'Oscuro' : 'Claro'}`}>
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              onPress={cycleTheme}
            >
              {themePref === 'system' ? (
                <Laptop className="w-4 h-4" />
              ) : themePref === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>

          {currentTrainer && (
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
          )}
        </div>
      </div>
    </header>
  );
}
