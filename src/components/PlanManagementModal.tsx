import React, { useState } from 'react';
import {
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalFooter,
  ModalCloseTrigger,
  Button,
  Chip,
  Card,
  CardContent
} from '@heroui/react';
import { Calendar, Trash2, Plus, Archive, ArchiveRestore, AlertCircle, Check } from 'lucide-react';
import { ClientPlan } from '../types';
import { deletePlan, toggleArchivePlan } from '../lib/api';
import { formatDateISO } from '../lib/utils';

interface PlanManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  plans: ClientPlan[];
  onOpenPlanBuilder: () => void;
  onPlansChanged: () => void;
}

export default function PlanManagementModal({
  isOpen,
  onClose,
  clientId,
  clientName,
  plans,
  onOpenPlanBuilder,
  onPlansChanged
}: PlanManagementModalProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busyPlanId, setBusyPlanId] = useState<string | null>(null);

  if (!isOpen) return null;

  const todayStr = formatDateISO(new Date());

  const getPlanStatus = (plan: ClientPlan) => {
    const isArchived = Boolean(plan.notes && plan.notes.includes('[ARCHIVADO]'));
    if (isArchived) {
      return {
        label: 'Archivado',
        variant: 'amber' as const,
        chipClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        isArchived: true
      };
    }
    if (plan.end_date && todayStr > plan.end_date) {
      return {
        label: 'Finalizado',
        variant: 'neutral' as const,
        chipClass: 'text-muted border-border bg-surface-secondary',
        isArchived: false
      };
    }
    if (plan.start_date && todayStr < plan.start_date) {
      return {
        label: 'Próximo',
        variant: 'sky' as const,
        chipClass: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
        isArchived: false
      };
    }
    return {
      label: 'Activo',
      variant: 'emerald' as const,
      chipClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 font-bold',
      isArchived: false
    };
  };

  const handleToggleArchive = async (plan: ClientPlan) => {
    try {
      setBusyPlanId(plan.id);
      const isArchived = Boolean(plan.notes && plan.notes.includes('[ARCHIVADO]'));
      await toggleArchivePlan(plan.id, !isArchived);
      onPlansChanged();
    } finally {
      setBusyPlanId(null);
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      setBusyPlanId(planId);
      await deletePlan(planId);
      setConfirmDeleteId(null);
      onPlansChanged();
    } finally {
      setBusyPlanId(null);
    }
  };

  return (
    <ModalBackdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContainer size="lg" placement="center" className="p-2 sm:p-4">
        <ModalDialog className="w-full max-w-2xl mx-auto overflow-hidden border border-border shadow-2xl bg-surface rounded-2xl">
          <ModalHeader className="flex items-start sm:items-center justify-between border-b border-border pb-3.5 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                <Calendar className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <ModalHeading className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
                  Mesociclos y Planes — {clientName}
                </ModalHeading>
                <p className="text-[11px] sm:text-xs font-medium text-muted truncate">
                  Historial de periodización, estado de mesociclos y archivado
                </p>
              </div>
            </div>
            <ModalCloseTrigger onClick={onClose} aria-label="Cerrar modal de gestión de planes" />
          </ModalHeader>

          <ModalBody className="py-4 sm:py-5 space-y-3.5 max-h-[70vh] overflow-y-auto">
            {plans.length === 0 ? (
              <Card className="border border-border shadow-xs bg-surface-secondary/40">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-10 h-10 mx-auto mb-2.5 text-emerald-400/80" aria-hidden="true" />
                  <h4 className="text-sm font-bold text-foreground mb-1">Sin Planes Registrados</h4>
                  <p className="text-xs text-muted max-w-xs mx-auto mb-4">
                    Este cliente aún no tiene un plan replicado asignado.
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    onPress={() => {
                      onClose();
                      onOpenPlanBuilder();
                    }}
                    className="font-bold text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                    <span>Crear Plan</span>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2.5">
                {plans.map((p) => {
                  const status = getPlanStatus(p);
                  const isBusy = busyPlanId === p.id;
                  const isConfirming = confirmDeleteId === p.id;

                  return (
                    <div
                      key={p.id}
                      className="border border-border rounded-xl p-3 sm:p-4 bg-surface hover:border-foreground/20 transition-all shadow-2xs space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-foreground truncate">
                              {p.name || p.plan_name || 'Plan de Entrenamiento'}
                            </h4>
                            <Chip
                              size="sm"
                              variant="soft"
                              className={`text-[10px] uppercase font-bold border h-5 px-1.5 ${status.chipClass}`}
                            >
                              {status.label}
                            </Chip>
                          </div>
                          <p className="text-[11px] sm:text-xs text-muted font-medium mt-0.5 tabular-nums">
                            {p.start_date || '—'} → {p.end_date || '—'}
                          </p>
                        </div>

                        {/* Plan Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                          {/* Archive / Reactivate */}
                          <Button
                            size="sm"
                            variant="ghost"
                            isDisabled={isBusy}
                            onPress={() => handleToggleArchive(p)}
                            aria-label={status.isArchived ? `Reactivar ${p.name}` : `Archivar ${p.name}`}
                            className="h-8 px-2.5 text-xs font-semibold text-muted hover:text-foreground rounded-lg"
                          >
                            {status.isArchived ? (
                              <>
                                <ArchiveRestore className="w-3.5 h-3.5 mr-1 text-emerald-400" aria-hidden="true" />
                                <span>Reactivar</span>
                              </>
                            ) : (
                              <>
                                <Archive className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                                <span>Archivar</span>
                              </>
                            )}
                          </Button>

                          {/* Delete Action */}
                          {isConfirming ? (
                            <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 rounded-lg p-0.5">
                              <Button
                                size="sm"
                                variant="danger"
                                isDisabled={isBusy}
                                onPress={() => handleDelete(p.id)}
                                aria-label="Confirmar eliminación del plan"
                                className="h-7 px-2 text-[10px] font-bold bg-rose-500 hover:bg-rose-600 text-white"
                              >
                                <Check className="w-3 h-3 mr-1" aria-hidden="true" />
                                <span>¿Eliminar?</span>
                              </Button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="h-7 px-1.5 text-[10px] text-muted hover:text-foreground cursor-pointer font-medium"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <Button
                              isIconOnly
                              size="sm"
                              variant="ghost"
                              isDisabled={isBusy}
                              onPress={() => setConfirmDeleteId(p.id)}
                              aria-label={`Eliminar plan ${p.name}`}
                              className="h-8 w-8 text-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {isConfirming && (
                        <div className="flex items-center gap-1.5 text-[11px] text-rose-400/90 bg-rose-500/[0.06] p-2 rounded-lg border border-rose-500/20">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>
                            Esta acción eliminará todas las rutinas diarias y ejercicios programados bajo este plan.
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ModalBody>

          <ModalFooter className="border-t border-border pt-3.5 flex items-center justify-between gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                onClose();
                onOpenPlanBuilder();
              }}
              className="font-bold text-xs sm:text-sm h-9 sm:h-10 px-3.5 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
            >
              <Plus className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              <span>Nuevo Mesociclo</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onPress={onClose}
              className="font-bold text-xs h-9 sm:h-10 px-4"
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
