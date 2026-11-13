import React, { useState, useEffect, useMemo } from 'react';
import { Button, Chip } from '@heroui/react';
import { Dumbbell, Users, Plus, UserCheck, LogOut, Sun, Moon, Laptop } from 'lucide-react';
import { getCurrentTrainer, logoutTrainer } from '../lib/pocketbase';
import { getThemePreference, setThemePreference, ThemePreference } from '../lib/theme';
import { Client } from '../types';
import VenefitSelect from './VenefitSelect';

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

  const clientOptions = useMemo(
    () => clients.map((c) => ({ value: c.id, label: c.name })),
    [clients]
  );

  useEffect(() => {
    setThemePref(getThemePreference());
  }, []);

  const cycleTheme = () => {
    const next: ThemePreference =
      themePref === 'system' ? 'dark' : themePref === 'dark' ? 'light' : 'system';
    setThemePref(next);
    setThemePreference(next);
  };

  const handleLogout = () => {
    if (window.confirm('¿Seguro que deseas cerrar la sesión del entrenador?')) {
      logoutTrainer();
    }
  };

  const themeLabel =
    themePref === 'system' ? 'Sistema' : themePref === 'dark' ? 'Oscuro' : 'Claro';

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Main Row */}
        <div className="flex items-center justify-between gap-2.5">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Dumbbell className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight font-heading text-foreground">
                Venefit
              </span>
              <Chip variant="soft" size="sm" className="font-extrabold text-[9px] text-emerald-400 border border-emerald-500/30 h-4.5 px-1.5">
                PRO
              </Chip>
            </div>
          </div>

          {/* Desktop Client Selector (sm+) */}
          <div className="hidden sm:flex items-center gap-2 flex-1 justify-center max-w-md mx-2">
            <div className="flex-1 min-w-0">
              <label htmlFor="client-selector-desktop" className="sr-only">
                Seleccionar cliente activo
              </label>
              <VenefitSelect
                id="client-selector-desktop"
                aria-label="Seleccionar cliente activo"
                value={selectedClient ? selectedClient.id : ''}
                onChange={(clientId) => {
                  const found = clients.find((c) => c.id === clientId);
                  if (found) onSelectClient(found);
                }}
                options={clientOptions}
                placeholder="Sin clientes registrados"
                disabled={clients.length === 0}
                startIcon={<Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                surfaceTone="surface"
                triggerClassName="h-8 font-semibold"
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              onPress={onOpenNewClientModal}
              aria-label="Agregar nuevo cliente"
              className="font-bold text-xs h-8 px-3 shrink-0 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              <span>Nuevo</span>
            </Button>
          </div>

          {/* Right Action Icons (Theme + Profile) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              onPress={cycleTheme}
              aria-label={`Cambiar tema visual (actual: ${themeLabel})`}
              className="h-8 w-8 text-foreground/80 hover:text-foreground"
            >
              {themePref === 'system' ? (
                <Laptop className="w-4 h-4" aria-hidden="true" />
              ) : themePref === 'dark' ? (
                <Moon className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Sun className="w-4 h-4" aria-hidden="true" />
              )}
            </Button>

            {currentTrainer && (
              <Button
                size="sm"
                variant="outline"
                onPress={handleLogout}
                aria-label={`Cerrar sesión de ${currentTrainer.name || currentTrainer.email}`}
                className="h-8 px-2 border-border text-foreground/90 font-medium text-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400 mr-1 shrink-0" aria-hidden="true" />
                <span className="hidden md:inline truncate max-w-[100px] text-[11px] font-semibold">
                  {currentTrainer.name || currentTrainer.email.split('@')[0]}
                </span>
                <LogOut className="w-3 h-3 opacity-70 ml-1 shrink-0" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Dedicated Client Selector Row (sm:hidden) */}
        <div className="sm:hidden flex items-center gap-2 mt-2 pt-2 border-t border-border/40">
          <div className="flex-1 min-w-0">
            <label htmlFor="client-selector-mobile" className="sr-only">
              Seleccionar cliente activo
            </label>
            <VenefitSelect
              id="client-selector-mobile"
              aria-label="Seleccionar cliente activo"
              value={selectedClient ? selectedClient.id : ''}
              onChange={(clientId) => {
                const found = clients.find((c) => c.id === clientId);
                if (found) onSelectClient(found);
              }}
              options={clientOptions}
              placeholder="Sin clientes registrados"
              disabled={clients.length === 0}
              startIcon={<Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              surfaceTone="surface"
              triggerClassName="h-9 font-bold"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onPress={onOpenNewClientModal}
            aria-label="Agregar nuevo cliente"
            className="font-bold text-xs h-9 px-3 shrink-0 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
            <span>Nuevo</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
