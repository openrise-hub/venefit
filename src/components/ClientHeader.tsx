import React, { useState } from 'react';
import { Card, CardContent, Chip, Button } from '@heroui/react';
import { Target, Weight, Ruler, Trash2, Plus, Check, Edit3 } from 'lucide-react';
import { Client, ClientPlan } from '../types';
import EditClientModal from './EditClientModal';

interface ClientHeaderProps {
  client: Client | null;
  plans?: ClientPlan[];
  onOpenPlanBuilder: () => void;
  onDeleteClient: (clientId: string) => void;
  onUpdateClient?: (updatedClient: Client) => void;
}

export default function ClientHeader({ 
  client, 
  plans = [], 
  onOpenPlanBuilder, 
  onDeleteClient,
  onUpdateClient
}: ClientHeaderProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!client) return null;

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDeleteClient(client.id);
    setConfirmDelete(false);
  };

  return (
    <Card className="mb-4 sm:mb-5 border border-border shadow-xs bg-surface">
      <CardContent className="p-3.5 sm:p-5 space-y-3">
        {/* Header: Avatar, Name, Plans Badge & Delete Action */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-black shrink-0 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-foreground truncate">
                  {client.name}
                </h2>
                {plans.length > 0 && (
                  <Chip size="sm" variant="soft" className="font-extrabold text-[10px] text-emerald-400 border border-emerald-500/30 shrink-0">
                    {plans.length}&nbsp;Plan{plans.length > 1 ? 'es' : ''}
                  </Chip>
                )}
              </div>
              {client.goal && (
                <p className="text-xs flex items-center gap-1.5 mt-0.5 text-muted font-medium truncate">
                  <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="truncate">{client.goal}</span>
                </p>
              )}
            </div>
          </div>

          {/* Actions: Edit and Delete */}
          <div className="flex items-center gap-1 shrink-0">
            {onUpdateClient && (
              <Button
                size="sm"
                variant="ghost"
                onPress={() => setIsEditModalOpen(true)}
                aria-label={`Editar datos de ${client.name}`}
                className="h-8 px-2 sm:px-2.5 text-xs font-semibold hover:text-emerald-400 rounded-xl"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
            )}

            {confirmDelete ? (
              <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 rounded-xl p-1 animate-in fade-in">
                <Button
                  size="sm"
                  variant="danger"
                  onPress={handleDelete}
                  aria-label={`Confirmar eliminar cliente ${client.name}`}
                  className="h-7 px-2 text-[10px] font-bold bg-rose-500 hover:bg-rose-600 text-white"
                >
                  <Check className="w-3 h-3 mr-1" aria-hidden="true" />
                  <span>¿Eliminar?</span>
                </Button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  aria-label="Cancelar eliminación"
                  className="h-7 px-1.5 text-[10px] text-muted hover:text-foreground cursor-pointer font-medium"
                >
                  No
                </button>
              </div>
            ) : (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => setConfirmDelete(true)}
                aria-label={`Eliminar cliente ${client.name}`}
                className="h-8 w-8 text-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>

        {/* Metrics & Add Plan Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1.5 border-t border-border/60">
          <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={() => onUpdateClient && setIsEditModalOpen(true)}
              className="flex-1 flex items-center gap-2 bg-surface-secondary/70 hover:bg-surface-secondary border border-border hover:border-emerald-500/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left"
              title="Haz clic para editar peso"
              aria-label={`Peso actual: ${client.current_weight || 'No registrado'}. Haz clic para editar`}
            >
              <Weight className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <div>
                <span className="text-[9px] block text-muted font-bold uppercase tracking-wider">Peso</span>
                <span className="text-xs font-black text-foreground tabular-nums">
                  {client.current_weight != null && client.current_weight > 0 ? `${client.current_weight} kg` : 'Sin registrar'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateClient && setIsEditModalOpen(true)}
              className="flex-1 flex items-center gap-2 bg-surface-secondary/70 hover:bg-surface-secondary border border-border hover:border-emerald-500/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left"
              title="Haz clic para editar altura"
              aria-label={`Altura: ${client.height || 'No registrada'}. Haz clic para editar`}
            >
              <Ruler className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <div>
                <span className="text-[9px] block text-muted font-bold uppercase tracking-wider">Altura</span>
                <span className="text-xs font-black text-foreground tabular-nums">
                  {client.height != null && client.height > 0 ? `${client.height} cm` : 'Sin registrar'}
                </span>
              </div>
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onPress={onOpenPlanBuilder}
            aria-label="Crear nuevo plan de entrenamiento"
            className="w-full sm:w-auto font-bold text-xs h-9 sm:h-8 px-3.5 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded-xl justify-center shrink-0"
          >
            <Plus className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
            <span>Nuevo Plan</span>
          </Button>
        </div>
      </CardContent>

      {/* Edit Client Modal */}
      {isEditModalOpen && onUpdateClient && (
        <EditClientModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          client={client}
          onClientUpdated={onUpdateClient}
        />
      )}
    </Card>
  );
}
