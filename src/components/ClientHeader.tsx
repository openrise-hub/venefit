import React from 'react';
import { Card, CardContent, Chip, Button } from '@heroui/react';
import { Target, Weight, Ruler, Trash2, Plus } from 'lucide-react';
import { Client, ClientPlan } from '../types';

interface ClientHeaderProps {
  client: Client | null;
  plans?: ClientPlan[];
  onOpenPlanBuilder: () => void;
  onDeleteClient: (clientId: string) => void;
}

export default function ClientHeader({ 
  client, 
  plans = [], 
  onOpenPlanBuilder, 
  onDeleteClient 
}: ClientHeaderProps) {
  if (!client) return null;

  return (
    <Card className="mb-5">
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 border">
            {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {client.name}
              </h2>
              {plans.length > 0 && (
                <Chip size="sm" variant="soft">
                  {plans.length} Plan{plans.length > 1 ? 'es' : ''}
                </Chip>
              )}
            </div>
            {client.goal && (
              <p className="text-xs flex items-center gap-1 mt-0.5 opacity-80">
                <Target className="w-3.5 h-3.5 shrink-0" />
                <span>{client.goal}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 border rounded-xl px-3.5 py-2 text-xs">
          {client.current_weight && (
            <div className="flex items-center gap-1.5 border-r pr-3">
              <Weight className="w-4 h-4" />
              <div>
                <span className="text-[10px] block opacity-70">Peso</span>
                <span className="font-bold">{client.current_weight} kg</span>
              </div>
            </div>
          )}

          {client.height && (
            <div className="flex items-center gap-1.5 pr-2">
              <Ruler className="w-4 h-4" />
              <div>
                <span className="text-[10px] block opacity-70">Altura</span>
                <span className="font-bold">{client.height} cm</span>
              </div>
            </div>
          )}

          <Button
            size="sm"
            variant="ghost"
            onPress={onOpenPlanBuilder}
          >
            <Plus />
            <span>Nuevo Plan</span>
          </Button>

          <Button
            isIconOnly
            size="sm"
            variant="danger-soft"
            onPress={() => {
              if (window.confirm(`¿Estás seguro de eliminar a ${client.name}?`)) {
                onDeleteClient(client.id);
              }
            }}
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
