import React, { memo, useState } from 'react';
import { Card, CardContent, Input, Button } from '@heroui/react';
import { formatDateISO } from '../../lib/utils';

export const MESOCYCLE_DURATIONS = [
  { id: '4w', label: '4 Semanas', days: 28 },
  { id: '8w', label: '8 Semanas', days: 56 },
  { id: '12w', label: '12 Semanas', days: 84 },
  { id: '16w', label: '16 Semanas', days: 112 },
  { id: 'custom', label: 'Personalizado', days: 0 }
];

interface PlanMetadataFormProps {
  planName: string;
  onPlanNameChange: (name: string) => void;
  startDateStr: string;
  onStartDateChange: (date: string) => void;
  endDateStr: string;
  onEndDateChange: (date: string) => void;
}

function PlanMetadataForm({
  planName,
  onPlanNameChange,
  startDateStr,
  onStartDateChange,
  endDateStr,
  onEndDateChange
}: PlanMetadataFormProps) {
  const [durationId, setDurationId] = useState('8w');

  const handleDurationSelect = (preset: typeof MESOCYCLE_DURATIONS[number]) => {
    setDurationId(preset.id);
    if (preset.days > 0) {
      const start = new Date(startDateStr + 'T00:00:00');
      const end = new Date(start);
      end.setDate(start.getDate() + preset.days);
      onEndDateChange(formatDateISO(end));
    }
  };

  const handleStartDateChange = (date: string) => {
    onStartDateChange(date);
    const selected = MESOCYCLE_DURATIONS.find(d => d.id === durationId);
    if (selected && selected.days > 0) {
      const start = new Date(date + 'T00:00:00');
      const end = new Date(start);
      end.setDate(start.getDate() + selected.days);
      onEndDateChange(formatDateISO(end));
    }
  };

  return (
    <Card className="p-3.5 sm:p-4">
      <CardContent className="p-0 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground block">Nombre del Mesociclo / Plan *</label>
          <Input
            placeholder="Ej. Fase 1: Hipertrofia 8 Semanas"
            value={planName}
            onChange={(e) => onPlanNameChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground block">Duración del Mesociclo</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {MESOCYCLE_DURATIONS.map((preset, idx) => {
              const isSelected = durationId === preset.id;
              return (
                <Button
                  key={preset.id}
                  size="sm"
                  variant={isSelected ? "primary" : "outline"}
                  className={`font-bold text-xs ${idx === MESOCYCLE_DURATIONS.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
                  onPress={() => handleDurationSelect(preset)}
                >
                  {preset.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground block">Inicio del Mesociclo</label>
            <Input
              type="date"
              value={startDateStr}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
          </div>

          {durationId === 'custom' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Término del Mesociclo</label>
              <Input
                type="date"
                value={endDateStr}
                onChange={(e) => onEndDateChange(e.target.value)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(PlanMetadataForm);
