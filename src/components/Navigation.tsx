import React from 'react';
import { Button } from '@heroui/react';
import { Calendar, PlusCircle, Users } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPlanBuilder: () => void;
}

export default function Navigation({ activeTab, setActiveTab, onOpenPlanBuilder }: NavigationProps) {
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-2 flex items-center justify-around border-t safe-bottom">
        <Button
          variant={activeTab === 'workout' ? 'primary' : 'ghost'}
          size="sm"
          onPress={() => setActiveTab('workout')}
        >
          <Calendar />
          <span>Rutinas</span>
        </Button>

        <div title="Crear Nuevo Plan">
          <Button
            variant="primary"
            size="lg"
            isIconOnly
            onPress={onOpenPlanBuilder}
          >
            <PlusCircle />
          </Button>
        </div>

        <Button
          variant={activeTab === 'clients' ? 'primary' : 'ghost'}
          size="sm"
          onPress={() => setActiveTab('clients')}
        >
          <Users />
          <span>Clientes</span>
        </Button>
      </nav>

      <div className="hidden md:block border-b px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'workout' ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setActiveTab('workout')}
            >
              <Calendar />
              <span>Rutinas & Calendario</span>
            </Button>

            <Button
              variant={activeTab === 'clients' ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setActiveTab('clients')}
            >
              <Users />
              <span>Lista de Clientes</span>
            </Button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onPress={onOpenPlanBuilder}
          >
            <PlusCircle />
            <span>Crear Plan de Entrenamiento</span>
          </Button>
        </div>
      </div>
    </>
  );
}
